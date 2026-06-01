import { nanoid } from "nanoid";
import seedData from "@/data/trips.json";
import {
  fakeRequest,
  notFound,
  unauthorized,
  validationError,
} from "./client";
import {
  getDb,
  type DbTrip,
  type TripActivity,
  type TripDay,
} from "./db";
import { ensureSeeded } from "./seed";

export type Trip = DbTrip;
export type { TripActivity, TripDay };
export type { ActivityType, ActivityStatus, TripCollaborator } from "./db";

const SEED_TRIPS = seedData as unknown as DbTrip[];

export function getAllTrips(): Trip[] {
  return SEED_TRIPS;
}

export function getTripById(id: string): Trip | undefined {
  return SEED_TRIPS.find((t) => t.id === id);
}

export function getUpcomingTrips(): Trip[] {
  return SEED_TRIPS.filter((t) => t.status === "upcoming");
}

async function requireSession(token: string) {
  if (!token) unauthorized();
  const db = await getDb();
  const session = await db.get("sessions", token);
  if (!session) unauthorized("Session expired");
  const user = await db.get("users", session.userId);
  return { db, userId: session.userId, userName: user?.name ?? "Someone" };
}

function appendActivityLog(
  trip: DbTrip,
  entry: { type: string; title: string; subtitle?: string },
) {
  trip.recentActivity = [
    {
      id: `ra-${nanoid(6)}`,
      type: entry.type,
      title: entry.title,
      subtitle: entry.subtitle,
      time: new Date().toISOString(),
    },
    ...(trip.recentActivity ?? []),
  ].slice(0, 40);
}

function assertOwnership(trip: DbTrip | undefined, userId: string): DbTrip {
  if (!trip) notFound("Trip");
  if (trip.userId === userId) return trip;
  const collaborator = trip.collaborators?.some((c) => c.id === userId);
  if (!collaborator) notFound("Trip");
  return trip;
}

function todayIso() {
  return new Date().toISOString();
}

export async function listTrips(token: string): Promise<DbTrip[]> {
  await ensureSeeded();
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const owned = await db.getAllFromIndex("trips", "by-user", userId);
    return owned.sort((a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
  });
}

export async function getTrip(token: string, id: string): Promise<DbTrip> {
  await ensureSeeded();
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const trip = await db.get("trips", id);
    return assertOwnership(trip, userId);
  });
}

export interface CreateTripInput {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  coverImage?: string;
}

function buildEmptyDays(startDate: string, endDate: string): TripDay[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalNights = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / 86_400_000),
  );
  const days: TripDay[] = [];
  for (let i = 0; i <= totalNights; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    days.push({
      day: i + 1,
      date: date.toISOString().slice(0, 10),
      title: `Day ${i + 1}`,
      activities: [],
    });
  }
  return days;
}

export async function createTrip(token: string, input: CreateTripInput): Promise<DbTrip> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const title = input.title.trim();
    if (!title) validationError("Trip title is required");
    if (!input.destination) validationError("Pick a destination");
    if (!input.startDate || !input.endDate) validationError("Dates are required");
    if (new Date(input.endDate) <= new Date(input.startDate)) {
      validationError("Return date must be after the start");
    }

    const days = buildEmptyDays(input.startDate, input.endDate);
    const nights = days.length - 1;
    const now = todayIso();
    const trip: DbTrip = {
      id: `trip-${nanoid(8)}`,
      userId,
      title,
      destination: input.destination,
      destinations: [input.destination],
      coverImage: input.coverImage,
      startDate: input.startDate,
      endDate: input.endDate,
      nights,
      status: "draft",
      planningProgress: 5,
      totalBudget: Math.max(0, input.totalBudget),
      spent: 0,
      budgetBreakdown: { flights: 0, hotels: 0, dining: 0, activities: 0, other: 0 },
      itinerary: days,
      collaborators: [],
      recentActivity: [
        {
          id: `ra-${nanoid(6)}`,
          type: "create",
          title: "Trip created",
          subtitle: `Started planning ${title}`,
          time: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    await db.put("trips", trip);
    return trip;
  });
}

export async function updateTrip(
  token: string,
  id: string,
  patch: Partial<Omit<DbTrip, "id" | "userId" | "createdAt">>,
): Promise<DbTrip> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const trip = await db.get("trips", id);
    const owned = assertOwnership(trip, userId);
    const next: DbTrip = { ...owned, ...patch, updatedAt: todayIso() };
    await db.put("trips", next);
    return next;
  });
}

export async function deleteTrip(token: string, id: string): Promise<void> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const trip = await db.get("trips", id);
    if (!trip) return;
    if (trip.userId !== userId) return;
    await db.delete("trips", id);
  });
}

export interface AddActivityInput {
  tripId: string;
  dayIndex: number;
  activity: Partial<TripActivity> & { title: string; type: TripActivity["type"] };
}

export async function addActivity(token: string, input: AddActivityInput): Promise<DbTrip> {
  return fakeRequest(async () => {
    const { db, userId, userName } = await requireSession(token);
    const trip = await db.get("trips", input.tripId);
    const owned = assertOwnership(trip, userId);
    const day = owned.itinerary[input.dayIndex];
    if (!day) validationError("Invalid day");
    const activity: TripActivity = {
      id: input.activity.id ?? `act-${nanoid(8)}`,
      type: input.activity.type,
      title: input.activity.title.trim(),
      time: input.activity.time,
      detail: input.activity.detail,
      status: input.activity.status ?? "pending",
      location: input.activity.location,
      coordinates: input.activity.coordinates,
      notes: input.activity.notes,
      cost: input.activity.cost,
      currency: input.activity.currency,
    };
    day.activities.push(activity);
    appendActivityLog(owned, {
      type: "add",
      title: `${userName} added an activity`,
      subtitle: `${activity.title} · ${day.title}`,
    });
    owned.updatedAt = todayIso();
    await db.put("trips", owned);
    return owned;
  });
}

export interface UpdateActivityInput {
  tripId: string;
  dayIndex: number;
  activityId: string;
  patch: Partial<Omit<TripActivity, "id">>;
}

export async function updateActivity(token: string, input: UpdateActivityInput): Promise<DbTrip> {
  return fakeRequest(async () => {
    const { db, userId, userName } = await requireSession(token);
    const trip = await db.get("trips", input.tripId);
    const owned = assertOwnership(trip, userId);
    const day = owned.itinerary[input.dayIndex];
    if (!day) validationError("Invalid day");
    const idx = day.activities.findIndex((a) => a.id === input.activityId);
    if (idx < 0) notFound("Activity");
    day.activities[idx] = { ...day.activities[idx], ...input.patch };
    appendActivityLog(owned, {
      type: "edit",
      title: `${userName} edited an activity`,
      subtitle: day.activities[idx].title,
    });
    owned.updatedAt = todayIso();
    await db.put("trips", owned);
    return owned;
  });
}

export interface DeleteActivityInput {
  tripId: string;
  dayIndex: number;
  activityId: string;
}

export async function deleteActivity(
  token: string,
  input: DeleteActivityInput,
): Promise<DbTrip> {
  return fakeRequest(async () => {
    const { db, userId, userName } = await requireSession(token);
    const trip = await db.get("trips", input.tripId);
    const owned = assertOwnership(trip, userId);
    const day = owned.itinerary[input.dayIndex];
    if (!day) validationError("Invalid day");
    const removed = day.activities.find((a) => a.id === input.activityId);
    day.activities = day.activities.filter((a) => a.id !== input.activityId);
    if (removed) {
      appendActivityLog(owned, {
        type: "delete",
        title: `${userName} removed an activity`,
        subtitle: removed.title,
      });
    }
    owned.updatedAt = todayIso();
    await db.put("trips", owned);
    return owned;
  });
}

export interface MoveActivityInput {
  tripId: string;
  activityId: string;
  fromDay: number;
  toDay: number;
  toIndex: number;
}

export async function moveActivity(token: string, input: MoveActivityInput): Promise<DbTrip> {
  return fakeRequest(async () => {
    const { db, userId, userName } = await requireSession(token);
    const trip = await db.get("trips", input.tripId);
    const owned = assertOwnership(trip, userId);
    const from = owned.itinerary[input.fromDay];
    const to = owned.itinerary[input.toDay];
    if (!from || !to) validationError("Invalid day");
    const idx = from.activities.findIndex((a) => a.id === input.activityId);
    if (idx < 0) notFound("Activity");
    const [activity] = from.activities.splice(idx, 1);
    const insertAt = Math.max(0, Math.min(input.toIndex, to.activities.length));
    to.activities.splice(insertAt, 0, activity);
    if (input.fromDay !== input.toDay) {
      appendActivityLog(owned, {
        type: "move",
        title: `${userName} moved an activity`,
        subtitle: `${activity.title} · ${from.title} → ${to.title}`,
      });
    }
    owned.updatedAt = todayIso();
    await db.put("trips", owned);
    return owned;
  });
}

export interface AddCollaboratorInput {
  tripId: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

export async function addCollaborator(
  token: string,
  input: AddCollaboratorInput,
): Promise<DbTrip> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const trip = await db.get("trips", input.tripId);
    const owned = assertOwnership(trip, userId);
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();
    if (!name) validationError("Name is required");
    if (!email) validationError("Email is required");
    const collaborator = {
      id: `clb-${nanoid(8)}`,
      name,
      avatar: input.avatar,
      role: input.role ?? "Editor",
    };
    owned.collaborators = [...(owned.collaborators ?? []), collaborator];
    owned.recentActivity = [
      {
        id: `ra-${nanoid(6)}`,
        type: "invite",
        title: "Collaborator invited",
        subtitle: `${name} (${email}) joined the trip`,
        time: new Date().toISOString(),
      },
      ...(owned.recentActivity ?? []),
    ].slice(0, 30);
    owned.updatedAt = todayIso();
    await db.put("trips", owned);
    return owned;
  });
}

export async function removeCollaborator(
  token: string,
  input: { tripId: string; collaboratorId: string },
): Promise<DbTrip> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const trip = await db.get("trips", input.tripId);
    const owned = assertOwnership(trip, userId);
    owned.collaborators = (owned.collaborators ?? []).filter(
      (c) => c.id !== input.collaboratorId,
    );
    owned.updatedAt = todayIso();
    await db.put("trips", owned);
    return owned;
  });
}

export interface AddPhotoInput {
  tripId: string;
  name: string;
  dataUrl: string;
  size: number;
  caption?: string;
}

export async function addPhoto(token: string, input: AddPhotoInput): Promise<DbTrip> {
  return fakeRequest(async () => {
    const { db, userId, userName } = await requireSession(token);
    const trip = await db.get("trips", input.tripId);
    const owned = assertOwnership(trip, userId);
    const photo = {
      id: `pho-${nanoid(8)}`,
      name: input.name,
      dataUrl: input.dataUrl,
      size: input.size,
      caption: input.caption?.trim() || undefined,
      uploadedAt: new Date().toISOString(),
      uploaderId: userId,
      uploaderName: userName,
    };
    owned.album = [photo, ...(owned.album ?? [])];
    appendActivityLog(owned, {
      type: "edit",
      title: `${userName} shared a photo`,
      subtitle: input.caption ?? input.name,
    });
    owned.updatedAt = todayIso();
    await db.put("trips", owned);
    return owned;
  });
}

export async function removePhoto(
  token: string,
  input: { tripId: string; photoId: string },
): Promise<DbTrip> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const trip = await db.get("trips", input.tripId);
    const owned = assertOwnership(trip, userId);
    owned.album = (owned.album ?? []).filter((p) => p.id !== input.photoId);
    owned.updatedAt = todayIso();
    await db.put("trips", owned);
    return owned;
  });
}

export interface ReorderDayInput {
  tripId: string;
  dayIndex: number;
  orderedIds: string[];
}

export async function reorderDayActivities(
  token: string,
  input: ReorderDayInput,
): Promise<DbTrip> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const trip = await db.get("trips", input.tripId);
    const owned = assertOwnership(trip, userId);
    const day = owned.itinerary[input.dayIndex];
    if (!day) validationError("Invalid day");
    const lookup = new Map(day.activities.map((a) => [a.id, a] as const));
    day.activities = input.orderedIds
      .map((id) => lookup.get(id))
      .filter((a): a is TripActivity => !!a);
    owned.updatedAt = todayIso();
    await db.put("trips", owned);
    return owned;
  });
}
