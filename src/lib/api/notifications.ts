import { nanoid } from "nanoid";
import {
  fakeRequest,
  notFound,
  unauthorized,
  validationError,
} from "./client";
import { ensureSeeded } from "./seed";
import { getDb, type DbNotification } from "./db";
import { broadcast } from "@/lib/realtime/channel";
import { userRoom } from "@/features/realtime/rooms";
import { sendMockEmail } from "./email";

export type Notification = DbNotification;

async function requireSession(token: string) {
  if (!token) unauthorized();
  const db = await getDb();
  const session = await db.get("sessions", token);
  if (!session) unauthorized("Session expired");
  return { db, userId: session.userId };
}

export async function listNotifications(token: string): Promise<DbNotification[]> {
  await ensureSeeded();
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const list = await db.getAllFromIndex("notifications", "by-user", userId);
    return list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  });
}

export interface CreateNotificationInput {
  type: DbNotification["type"];
  title: string;
  body?: string;
  link?: string;
}

export async function createNotification(
  token: string,
  input: CreateNotificationInput,
): Promise<DbNotification> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    if (!input.title.trim()) validationError("Title required");
    const notification: DbNotification = {
      id: `ntf-${nanoid(10)}`,
      userId,
      type: input.type,
      title: input.title.trim(),
      body: input.body?.trim() || undefined,
      link: input.link,
      readAt: undefined,
      createdAt: new Date().toISOString(),
    };
    await db.put("notifications", notification);
    broadcast(userRoom(userId), "notification:new", {
      id: notification.id,
      title: notification.title,
      body: notification.body,
      link: notification.link,
    });

    const user = await db.get("users", userId);
    if (user?.preferences.notifications) {
      sendMockEmail({
        to: user.email,
        subject: notification.title,
        body: notification.body ?? "Open Voyager to see the details.",
      });
    }

    return notification;
  });
}

export async function markNotificationRead(
  token: string,
  id: string,
): Promise<DbNotification> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const notification = await db.get("notifications", id);
    if (!notification || notification.userId !== userId) notFound("Notification");
    if (notification.readAt) return notification;
    const next: DbNotification = { ...notification, readAt: new Date().toISOString() };
    await db.put("notifications", next);
    return next;
  });
}

export async function markAllNotificationsRead(token: string): Promise<number> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const list = await db.getAllFromIndex("notifications", "by-user", userId);
    const unread = list.filter((n) => !n.readAt);
    if (unread.length === 0) return 0;
    const now = new Date().toISOString();
    const tx = db.transaction("notifications", "readwrite");
    await Promise.all(unread.map((n) => tx.objectStore("notifications").put({ ...n, readAt: now })));
    await tx.done;
    return unread.length;
  });
}

export async function dismissNotification(token: string, id: string): Promise<void> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const notification = await db.get("notifications", id);
    if (!notification || notification.userId !== userId) return;
    await db.delete("notifications", id);
  });
}
