import { nanoid } from "nanoid";
import { fakeRequest, unauthorized } from "./client";
import { getDb, type DbFavorite } from "./db";

export type FavoriteEntityType = DbFavorite["entityType"];

export interface ToggleFavoriteInput {
  entityType: FavoriteEntityType;
  entityId: string;
}

export interface ToggleFavoriteResult {
  favorited: boolean;
  favorite?: DbFavorite;
}

async function resolveUserId(token: string): Promise<string> {
  if (!token) unauthorized();
  const db = await getDb();
  const session = await db.get("sessions", token);
  if (!session) unauthorized("Session expired");
  return session.userId;
}

export async function listFavorites(token: string): Promise<DbFavorite[]> {
  return fakeRequest(async () => {
    const userId = await resolveUserId(token);
    const db = await getDb();
    return db.getAllFromIndex("favorites", "by-user", userId);
  });
}

export async function isFavorite(
  token: string,
  input: ToggleFavoriteInput,
): Promise<boolean> {
  return fakeRequest(async () => {
    const userId = await resolveUserId(token);
    const db = await getDb();
    const matches = await db.getAllFromIndex("favorites", "by-entity", [
      input.entityType,
      input.entityId,
    ]);
    return matches.some((m) => m.userId === userId);
  });
}

export async function toggleFavorite(
  token: string,
  input: ToggleFavoriteInput,
): Promise<ToggleFavoriteResult> {
  return fakeRequest(async () => {
    const userId = await resolveUserId(token);
    const db = await getDb();
    const matches = await db.getAllFromIndex("favorites", "by-entity", [
      input.entityType,
      input.entityId,
    ]);
    const existing = matches.find((m) => m.userId === userId);
    if (existing) {
      await db.delete("favorites", existing.id);
      return { favorited: false };
    }
    const favorite: DbFavorite = {
      id: `fav-${nanoid(10)}`,
      userId,
      entityType: input.entityType,
      entityId: input.entityId,
      createdAt: new Date().toISOString(),
    };
    await db.put("favorites", favorite);
    return { favorited: true, favorite };
  });
}
