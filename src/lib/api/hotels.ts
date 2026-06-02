import data from "@/data/hotels.json";
import { fakeRequest, notFound } from "./client";
import type { Paginated } from "./types";

export type Hotel = (typeof data)[number];

const HOTELS = data as Hotel[];

export type HotelSortKey =
  | "popular"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "name-asc";

export interface HotelFilters {
  search?: string;
  destinationId?: string;
  neighborhoods?: string[];
  amenities?: string[];
  propertyTypes?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: HotelSortKey;
  page?: number;
  pageSize?: number;
}

function matchesSearch(h: Hotel, query: string) {
  const haystack = [
    h.name,
    h.neighborhood,
    h.propertyType,
    h.description,
    ...(h.tags ?? []),
    ...(h.amenities ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function applyFilters(items: Hotel[], filters: HotelFilters) {
  return items.filter((h) => {
    if (filters.destinationId && h.destinationId !== filters.destinationId) return false;
    if (filters.search) {
      const q = filters.search.trim().toLowerCase();
      if (q && !matchesSearch(h, q)) return false;
    }
    if (filters.neighborhoods?.length && !filters.neighborhoods.includes(h.neighborhood)) {
      return false;
    }
    if (filters.propertyTypes?.length && !filters.propertyTypes.includes(h.propertyType)) {
      return false;
    }
    if (filters.amenities?.length) {
      const have = new Set((h.amenities ?? []).map((a) => a.toLowerCase()));
      const needed = filters.amenities.map((a) => a.toLowerCase());
      if (!needed.every((a) => have.has(a))) return false;
    }
    if (filters.minPrice !== undefined && h.pricePerNight < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && h.pricePerNight > filters.maxPrice) return false;
    if (filters.minRating !== undefined && h.rating < filters.minRating) return false;
    return true;
  });
}

function applySort(items: Hotel[], sort: HotelSortKey = "popular") {
  const copy = [...items];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.pricePerNight - b.pricePerNight);
    case "price-desc":
      return copy.sort((a, b) => b.pricePerNight - a.pricePerNight);
    case "rating-desc":
      return copy.sort((a, b) => b.rating - a.rating);
    case "name-asc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "popular":
    default:
      return copy.sort((a, b) => b.reviewCount - a.reviewCount);
  }
}

export async function listHotels(filters: HotelFilters = {}): Promise<Paginated<Hotel>> {
  return fakeRequest(() => {
    const filtered = applyFilters(HOTELS, filters);
    const sorted = applySort(filtered, filters.sort);
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.max(1, Math.min(filters.pageSize ?? 9, 50));
    const start = (page - 1) * pageSize;
    return {
      items: sorted.slice(start, start + pageSize),
      total: sorted.length,
      page,
      pageSize,
    };
  });
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

export async function getHotelsByDestination(destinationId: string): Promise<Hotel[]> {
  return fakeRequest(() => HOTELS.filter((h) => h.destinationId === destinationId));
}

export function getHotelNeighborhoods(destinationId?: string): string[] {
  const pool = destinationId ? HOTELS.filter((h) => h.destinationId === destinationId) : HOTELS;
  return Array.from(new Set(pool.map((h) => h.neighborhood))).sort();
}

export function getHotelAmenities(): string[] {
  const set = new Set<string>();
  HOTELS.forEach((h) => (h.amenities ?? []).forEach((a) => set.add(a)));
  return Array.from(set).sort();
}

export function getHotelPropertyTypes(): string[] {
  return Array.from(new Set(HOTELS.map((h) => h.propertyType))).sort();
}

export function getHotelPriceRange(): { min: number; max: number } {
  const prices = HOTELS.map((h) => h.pricePerNight);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
