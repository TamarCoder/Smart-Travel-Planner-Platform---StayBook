import { nanoid } from "nanoid";
import {
  fakeRequest,
  notFound,
  unauthorized,
  validationError,
} from "./client";
import { getDb, type DbComment } from "./db";

export type Comment = DbComment;

export const REACTION_EMOJIS = ["👍", "❤️", "🔥", "🎉", "🤔", "🙌"] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

async function requireSession(token: string) {
  if (!token) unauthorized();
  const db = await getDb();
  const session = await db.get("sessions", token);
  if (!session) unauthorized("Session expired");
  const user = await db.get("users", session.userId);
  if (!user) unauthorized("User missing");
  return { db, user };
}

export async function listComments(
  token: string,
  options: { tripId?: string; activityId?: string },
): Promise<DbComment[]> {
  return fakeRequest(async () => {
    const { db } = await requireSession(token);
    if (options.activityId) {
      const list = await db.getAllFromIndex("comments", "by-activity", options.activityId);
      return list.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
    }
    if (options.tripId) {
      const list = await db.getAllFromIndex("comments", "by-trip", options.tripId);
      return list.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
    }
    return [];
  });
}

export interface CreateCommentInput {
  tripId: string;
  activityId: string;
  text: string;
}

export async function createComment(
  token: string,
  input: CreateCommentInput,
): Promise<DbComment> {
  return fakeRequest(async () => {
    const { db, user } = await requireSession(token);
    const text = input.text.trim();
    if (!text) validationError("Comment cannot be empty");
    const comment: DbComment = {
      id: `cmt-${nanoid(10)}`,
      tripId: input.tripId,
      activityId: input.activityId,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      text,
      reactions: {},
      createdAt: new Date().toISOString(),
    };
    await db.put("comments", comment);
    return comment;
  });
}

export async function deleteComment(token: string, id: string): Promise<void> {
  return fakeRequest(async () => {
    const { db, user } = await requireSession(token);
    const comment = await db.get("comments", id);
    if (!comment || comment.authorId !== user.id) return;
    await db.delete("comments", id);
  });
}

export interface ToggleReactionInput {
  commentId: string;
  emoji: ReactionEmoji;
}

export async function toggleReaction(
  token: string,
  input: ToggleReactionInput,
): Promise<DbComment> {
  return fakeRequest(async () => {
    const { db, user } = await requireSession(token);
    const comment = await db.get("comments", input.commentId);
    if (!comment) notFound("Comment");
    const reactions = { ...comment.reactions };
    const list = reactions[input.emoji] ?? [];
    reactions[input.emoji] = list.includes(user.id)
      ? list.filter((id) => id !== user.id)
      : [...list, user.id];
    if (reactions[input.emoji].length === 0) {
      delete reactions[input.emoji];
    }
    const next: DbComment = { ...comment, reactions };
    await db.put("comments", next);
    return next;
  });
}
