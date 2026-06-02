import { nanoid } from "nanoid";
import {
  conflict,
  fakeRequest,
  notFound,
  unauthorized,
  validationError,
} from "./client";
import { getDb, type DbSession, type DbUser } from "./db";
import { ensureSeeded, hashPassword, verifyPassword } from "./seed";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  preferences?: DbUser["preferences"];
}

export interface AuthResult {
  user: AuthUser;
  token: string;
  expiresAt: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

const SESSION_DAYS = 14;

function toAuthUser(user: DbUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    preferences: user.preferences,
  };
}

function buildSession(userId: string): DbSession {
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  return {
    token: nanoid(48),
    userId,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  };
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  await ensureSeeded();
  return fakeRequest(async () => {
    const name = input.name.trim();
    const email = normalizeEmail(input.email);
    if (!name || !email || !input.password) {
      validationError("All fields are required");
    }
    if (input.password.length < 8) {
      validationError("Password must be at least 8 characters");
    }

    const db = await getDb();
    const existing = await db.getFromIndex("users", "by-email", email);
    if (existing) {
      conflict("Email already registered");
    }

    const now = new Date().toISOString();
    const user: DbUser = {
      id: `user-${nanoid(8)}`,
      name,
      email,
      joinedAt: now,
      role: "Member",
      passwordHash: await hashPassword(input.password),
      preferences: {
        currency: "USD",
        travelStyle: [],
        notifications: true,
      },
      stats: {
        tripsPlanned: 0,
        countriesVisited: 0,
        milesFlown: 0,
        totalSpent: 0,
      },
    };

    const session = buildSession(user.id);
    const tx = db.transaction(["users", "sessions"], "readwrite");
    await Promise.all([
      tx.objectStore("users").put(user),
      tx.objectStore("sessions").put(session),
    ]);
    await tx.done;

    return { user: toAuthUser(user), token: session.token, expiresAt: session.expiresAt };
  });
}

export async function login(input: LoginInput): Promise<AuthResult> {
  await ensureSeeded();
  return fakeRequest(async () => {
    const email = normalizeEmail(input.email);
    if (!email || !input.password) {
      validationError("Email and password are required");
    }

    const db = await getDb();
    const user = await db.getFromIndex("users", "by-email", email);
    if (!user) {
      unauthorized("Incorrect email or password");
    }

    const matches = await verifyPassword(input.password, user.passwordHash);
    if (!matches) {
      unauthorized("Incorrect email or password");
    }

    const session = buildSession(user.id);
    await db.put("sessions", session);

    return { user: toAuthUser(user), token: session.token, expiresAt: session.expiresAt };
  });
}

export async function logout(token: string): Promise<void> {
  return fakeRequest(async () => {
    if (!token) return;
    const db = await getDb();
    await db.delete("sessions", token);
  });
}

export async function getCurrentUser(token: string): Promise<AuthUser> {
  await ensureSeeded();
  return fakeRequest(async () => {
    if (!token) unauthorized();
    const db = await getDb();
    const session = await db.get("sessions", token);
    if (!session) unauthorized("Session expired");
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      await db.delete("sessions", token);
      unauthorized("Session expired");
    }
    const user = await db.get("users", session.userId);
    if (!user) notFound("User");
    return toAuthUser(user);
  });
}

export async function updateProfile(
  token: string,
  patch: Partial<Pick<AuthUser, "name" | "avatar" | "preferences">>,
): Promise<AuthUser> {
  return fakeRequest(async () => {
    if (!token) unauthorized();
    const db = await getDb();
    const session = await db.get("sessions", token);
    if (!session) unauthorized("Session expired");
    const user = await db.get("users", session.userId);
    if (!user) notFound("User");
    const next: DbUser = {
      ...user,
      name: patch.name?.trim() || user.name,
      avatar: patch.avatar ?? user.avatar,
      preferences: patch.preferences ?? user.preferences,
    };
    await db.put("users", next);
    return toAuthUser(next);
  });
}
