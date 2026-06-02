import { openDB, type DBSchema, type IDBPDatabase } from "idb";

export const DB_NAME = "staybook";
export const DB_VERSION = 2;

export interface DbUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  joinedAt: string;
  passwordHash: string;
  preferences: {
    currency: string;
    travelStyle: string[];
    notifications: boolean;
  };
  stats?: {
    tripsPlanned: number;
    countriesVisited: number;
    milesFlown: number;
    totalSpent: number;
  };
}

export interface DbSession {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export type ActivityType =
  | "flight"
  | "transfer"
  | "hotel"
  | "activity"
  | "dining"
  | "spa"
  | "tour"
  | "note";

export type ActivityStatus = "pending" | "confirmed" | "cancelled";

export interface TripAttachment {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  dataUrl: string;
  uploadedAt: string;
}

export interface TripActivity {
  id: string;
  time?: string;
  type: ActivityType;
  title: string;
  detail?: string;
  status?: ActivityStatus;
  location?: string;
  coordinates?: { lat: number; lng: number };
  notes?: string;
  cost?: number;
  currency?: string;
  attachments?: TripAttachment[];
}

export interface TripDay {
  day: number;
  date: string;
  title: string;
  activities: TripActivity[];
}

export interface TripCollaborator {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface TripActivityLog {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  time: string;
}

export interface TripPhoto {
  id: string;
  name: string;
  dataUrl: string;
  size: number;
  caption?: string;
  uploadedAt: string;
  uploaderId: string;
  uploaderName: string;
}

export interface DbTrip {
  id: string;
  userId: string;
  title: string;
  destination: string;
  destinations?: string[];
  coverImage?: string;
  startDate: string;
  endDate: string;
  nights: number;
  status: "draft" | "upcoming" | "active" | "completed" | "cancelled";
  daysLeft?: number;
  planningProgress: number;
  totalBudget: number;
  spent: number;
  budgetBreakdown: Record<string, number>;
  milesMowed?: number;
  carbonFootprint?: number;
  itinerary: TripDay[];
  collaborators?: TripCollaborator[];
  recentActivity?: TripActivityLog[];
  album?: TripPhoto[];
  createdAt: string;
  updatedAt: string;
}

export interface DbBooking {
  id: string;
  userId: string;
  tripId?: string;
  kind?: "hotel" | "experience" | "transport";
  hotelId?: string;
  itemId?: string;
  itemName?: string;
  itemImage?: string;
  date?: string;
  quantity?: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  totalPrice: number;
  currency: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface DbFavorite {
  id: string;
  userId: string;
  entityType: "destination" | "hotel" | "attraction";
  entityId: string;
  createdAt: string;
}

export interface DbExpense {
  id: string;
  tripId: string;
  userId: string;
  category: string;
  amount: number;
  currency: string;
  note?: string;
  spentAt: string;
  createdAt: string;
}

export interface DbNotification {
  id: string;
  userId: string;
  type: "trip" | "booking" | "collaboration" | "system";
  title: string;
  body?: string;
  link?: string;
  readAt?: string;
  createdAt: string;
}

export interface DbComment {
  id: string;
  tripId: string;
  activityId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  reactions: Record<string, string[]>;
  createdAt: string;
}

export interface DbMeta {
  key: string;
  value: unknown;
}

interface StayBookDb extends DBSchema {
  meta: { key: string; value: DbMeta };
  users: { key: string; value: DbUser; indexes: { "by-email": string } };
  sessions: { key: string; value: DbSession; indexes: { "by-user": string } };
  trips: { key: string; value: DbTrip; indexes: { "by-user": string; "by-status": string } };
  bookings: {
    key: string;
    value: DbBooking;
    indexes: { "by-user": string; "by-trip": string };
  };
  favorites: {
    key: string;
    value: DbFavorite;
    indexes: { "by-user": string; "by-entity": [string, string] };
  };
  expenses: {
    key: string;
    value: DbExpense;
    indexes: { "by-trip": string; "by-user": string };
  };
  notifications: {
    key: string;
    value: DbNotification;
    indexes: { "by-user": string; "by-read": string };
  };
  comments: {
    key: string;
    value: DbComment;
    indexes: { "by-trip": string; "by-activity": string };
  };
}

let dbPromise: Promise<IDBPDatabase<StayBookDb>> | null = null;

export function getDb(): Promise<IDBPDatabase<StayBookDb>> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Database is only available in the browser"));
  }
  if (!dbPromise) {
    dbPromise = openDB<StayBookDb>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("meta")) {
          db.createObjectStore("meta", { keyPath: "key" });
        }
        if (!db.objectStoreNames.contains("users")) {
          const store = db.createObjectStore("users", { keyPath: "id" });
          store.createIndex("by-email", "email", { unique: true });
        }
        if (!db.objectStoreNames.contains("sessions")) {
          const store = db.createObjectStore("sessions", { keyPath: "token" });
          store.createIndex("by-user", "userId");
        }
        if (!db.objectStoreNames.contains("trips")) {
          const store = db.createObjectStore("trips", { keyPath: "id" });
          store.createIndex("by-user", "userId");
          store.createIndex("by-status", "status");
        }
        if (!db.objectStoreNames.contains("bookings")) {
          const store = db.createObjectStore("bookings", { keyPath: "id" });
          store.createIndex("by-user", "userId");
          store.createIndex("by-trip", "tripId");
        }
        if (!db.objectStoreNames.contains("favorites")) {
          const store = db.createObjectStore("favorites", { keyPath: "id" });
          store.createIndex("by-user", "userId");
          store.createIndex("by-entity", ["entityType", "entityId"]);
        }
        if (!db.objectStoreNames.contains("expenses")) {
          const store = db.createObjectStore("expenses", { keyPath: "id" });
          store.createIndex("by-trip", "tripId");
          store.createIndex("by-user", "userId");
        }
        if (!db.objectStoreNames.contains("notifications")) {
          const store = db.createObjectStore("notifications", { keyPath: "id" });
          store.createIndex("by-user", "userId");
          store.createIndex("by-read", "readAt");
        }
        if (!db.objectStoreNames.contains("comments")) {
          const store = db.createObjectStore("comments", { keyPath: "id" });
          store.createIndex("by-trip", "tripId");
          store.createIndex("by-activity", "activityId");
        }
      },
    });
  }
  return dbPromise;
}

export async function resetDb(): Promise<void> {
  if (typeof window === "undefined") return;
  if (dbPromise) {
    const db = await dbPromise;
    db.close();
    dbPromise = null;
  }
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve();
  });
}

export type { StayBookDb };
export type { IDBPDatabase } from "idb";
