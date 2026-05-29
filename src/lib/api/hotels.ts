import data from "@/data/hotels.json";
import { fakeRequest, notFound } from "./client";

export type Hotel = (typeof data)[number];

const HOTELS = data as Hotel[];

export async function listHotels(destinationId?: string): Promise<Hotel[]> {
  return fakeRequest(() =>
    destinationId
      ? HOTELS.filter((h) => h.destinationId === destinationId)
      : HOTELS,
  );
}

export async function getHotelById(id: string): Promise<Hotel> {
  return fakeRequest(() => {
    const found = HOTELS.find((h) => h.id === id);
    if (!found) notFound("Hotel");
    return found;
  });
}

export async function getHotelsByIds(ids: string[]): Promise<Hotel[]> {
  return fakeRequest(() => HOTELS.filter((h) => ids.includes(h.id)));
}

export async function getDestinationsForHotels(): Promise<string[]> {
  return fakeRequest(() => Array.from(new Set(HOTELS.map((h) => h.destinationId))));
}
