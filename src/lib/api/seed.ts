import userData from "@/data/user.json";
import tripsData from "@/data/trips.json";
import { getDb, type DbTrip, type DbUser } from "./db";

const SEED_KEY = "seedVersion";
const SEED_VERSION = 1;

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
  itinerary: unknown[];
  collaborators?: DbTrip["collaborators"];
  recentActivity?: unknown[];
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
  if (current && (current.value as number) >= SEED_VERSION) return;

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
