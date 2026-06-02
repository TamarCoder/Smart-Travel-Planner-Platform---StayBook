import userData from "@/data/user.json";
import tripsData from "@/data/trips.json";
import expensesData from "@/data/expenses.json";
import notificationsData from "@/data/notifications.json";
import {
  getDb,
  type DbExpense,
  type DbNotification,
  type DbTrip,
  type DbUser,
  type TripDay,
  type TripActivityLog,
} from "./db";

const SEED_KEY = "seedVersion";
const SEED_VERSION = 1;
const EXPENSES_SEED_KEY = "expensesSeedVersion";
const EXPENSES_SEED_VERSION = 1;
const NOTIFICATIONS_SEED_KEY = "notificationsSeedVersion";
const NOTIFICATIONS_SEED_VERSION = 1;

function encodePassword(plain: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(plain).toString("base64");
  }
  return window.btoa(unescape(encodeURIComponent(plain)));
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return encodePassword(plain) === hash;
}

export async function hashPassword(plain: string): Promise<string> {
  return encodePassword(plain);
}

interface RawUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  joinedAt: string;
  password: string;
  preferences: DbUser["preferences"];
  stats?: DbUser["stats"];
}

interface RawTrip {
  id: string;
  title: string;
  destination: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  nights: number;
  status: string;
  planningProgress?: number;
  totalBudget: number;
  spent: number;
  budgetBreakdown: Record<string, number>;
  milesMowed?: number;
  carbonFootprint?: number;
  itinerary: TripDay[];
  collaborators?: DbTrip["collaborators"];
  recentActivity?: TripActivityLog[];
}

function toDbUser(raw: RawUser): DbUser {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    avatar: raw.avatar,
    role: raw.role,
    joinedAt: raw.joinedAt,
    passwordHash: encodePassword(raw.password),
    preferences: raw.preferences,
    stats: raw.stats,
  };
}

function toDbTrip(raw: RawTrip, userId: string, now: string): DbTrip {
  return {
    id: raw.id,
    userId,
    title: raw.title,
    destination: raw.destination,
    coverImage: raw.coverImage,
    startDate: raw.startDate,
    endDate: raw.endDate,
    nights: raw.nights,
    status: (raw.status as DbTrip["status"]) ?? "upcoming",
    planningProgress: raw.planningProgress ?? 0,
    totalBudget: raw.totalBudget,
    spent: raw.spent,
    budgetBreakdown: raw.budgetBreakdown,
    milesMowed: raw.milesMowed,
    carbonFootprint: raw.carbonFootprint,
    itinerary: raw.itinerary,
    collaborators: raw.collaborators,
    recentActivity: raw.recentActivity,
    createdAt: now,
    updatedAt: now,
  };
}

export async function ensureSeeded(): Promise<void> {
  if (typeof window === "undefined") return;

  const db = await getDb();
  const current = await db.get("meta", SEED_KEY);
  if (!current || (current.value as number) < SEED_VERSION) {
    const now = new Date().toISOString();
    const rawUser = userData as RawUser;
    const user = toDbUser(rawUser);
    const trips = (tripsData as RawTrip[]).map((t) => toDbTrip(t, user.id, now));

    const tx = db.transaction(["meta", "users", "trips"], "readwrite");
    await Promise.all([
      tx.objectStore("users").put(user),
      ...trips.map((t) => tx.objectStore("trips").put(t)),
      tx.objectStore("meta").put({ key: SEED_KEY, value: SEED_VERSION }),
    ]);
    await tx.done;
  }

  const expensesMeta = await db.get("meta", EXPENSES_SEED_KEY);
  if (!expensesMeta || (expensesMeta.value as number) < EXPENSES_SEED_VERSION) {
    const expenses = expensesData as DbExpense[];
    const tx = db.transaction(["meta", "expenses"], "readwrite");
    await Promise.all([
      ...expenses.map((e) => tx.objectStore("expenses").put(e)),
      tx.objectStore("meta").put({ key: EXPENSES_SEED_KEY, value: EXPENSES_SEED_VERSION }),
    ]);
    await tx.done;
  }

  const notificationsMeta = await db.get("meta", NOTIFICATIONS_SEED_KEY);
  if (!notificationsMeta || (notificationsMeta.value as number) < NOTIFICATIONS_SEED_VERSION) {
    const notifications = (notificationsData as unknown as DbNotification[]).map((n) => ({
      ...n,
      readAt: n.readAt ?? undefined,
    }));
    const tx = db.transaction(["meta", "notifications"], "readwrite");
    await Promise.all([
      ...notifications.map((n) => tx.objectStore("notifications").put(n)),
      tx.objectStore("meta").put({ key: NOTIFICATIONS_SEED_KEY, value: NOTIFICATIONS_SEED_VERSION }),
    ]);
    await tx.done;
  }
}
