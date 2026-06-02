import { nanoid } from "nanoid";
import hotelsData from "@/data/hotels.json";
import {
  conflict,
  fakeRequest,
  notFound,
  unauthorized,
  validationError,
} from "./client";
import { ensureSeeded } from "./seed";
import { getDb, type DbBooking } from "./db";
import { getNights, getStayTotal, isHotelAvailable } from "@/lib/utils/availability";
import type { Hotel } from "./hotels";

export type Booking = DbBooking;

const HOTELS = hotelsData as Hotel[];

function findHotel(id: string): Hotel | undefined {
  return HOTELS.find((h) => h.id === id);
}

async function requireSession(token: string) {
  if (!token) unauthorized();
  const db = await getDb();
  const session = await db.get("sessions", token);
  if (!session) unauthorized("Session expired");
  return { db, userId: session.userId };
}

export async function listBookings(token: string): Promise<DbBooking[]> {
  await ensureSeeded();
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const list = await db.getAllFromIndex("bookings", "by-user", userId);
    return list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  });
}

export async function getBookingById(token: string, id: string): Promise<DbBooking> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const booking = await db.get("bookings", id);
    if (!booking || booking.userId !== userId) notFound("Booking");
    return booking;
  });
}

export interface CreateBookingInput {
  hotelId: string;
  tripId?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

export async function createBooking(
  token: string,
  input: CreateBookingInput,
): Promise<DbBooking> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    if (!input.hotelId) validationError("Hotel is required");
    if (!input.checkIn || !input.checkOut) validationError("Dates are required");
    const nights = getNights(input.checkIn, input.checkOut);
    if (nights <= 0) validationError("Return must be after check-in");
    if (input.guests <= 0 || input.rooms <= 0) {
      validationError("Guests and rooms must be at least 1");
    }
    const hotel = findHotel(input.hotelId);
    if (!hotel) notFound("Hotel");
    if (!isHotelAvailable(hotel.id, input.checkIn, input.checkOut)) {
      conflict("These dates are sold out for this hotel");
    }

    const totalPrice = getStayTotal(hotel.pricePerNight, nights) * input.rooms;
    const booking: DbBooking = {
      id: `bkg-${nanoid(10)}`,
      userId,
      kind: "hotel",
      tripId: input.tripId,
      hotelId: hotel.id,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guests: input.guests,
      rooms: input.rooms,
      totalPrice,
      currency: hotel.currency,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    await db.put("bookings", booking);
    return booking;
  });
}

export interface CreateItemBookingInput {
  kind: "experience" | "transport";
  itemId: string;
  itemName: string;
  itemImage?: string;
  date: string;
  quantity: number;
  price: number;
  currency: string;
  tripId?: string;
}

export async function createItemBooking(
  token: string,
  input: CreateItemBookingInput,
): Promise<DbBooking> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    if (!input.itemId || !input.itemName) validationError("Item is required");
    if (!input.date) validationError("Pick a date");
    const quantity = Math.max(1, input.quantity);
    const booking: DbBooking = {
      id: `bkg-${nanoid(10)}`,
      userId,
      kind: input.kind,
      tripId: input.tripId,
      itemId: input.itemId,
      itemName: input.itemName,
      itemImage: input.itemImage,
      date: input.date,
      quantity,
      checkIn: input.date,
      checkOut: input.date,
      guests: quantity,
      rooms: 1,
      totalPrice: input.price * quantity,
      currency: input.currency,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    await db.put("bookings", booking);
    return booking;
  });
}

export async function cancelBooking(token: string, id: string): Promise<DbBooking> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const booking = await db.get("bookings", id);
    if (!booking || booking.userId !== userId) notFound("Booking");
    const next: DbBooking = { ...booking, status: "cancelled" };
    await db.put("bookings", next);
    return next;
  });
}

export async function deleteBooking(token: string, id: string): Promise<void> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const booking = await db.get("bookings", id);
    if (!booking || booking.userId !== userId) return;
    await db.delete("bookings", id);
  });
}
