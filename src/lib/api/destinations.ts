import data from "@/data/destinations.json";
import attractionsData from "@/data/attractions.json";
import { fakeRequest, notFound } from "./client";
import type { Paginated } from "./types";

export type Destination = (typeof data)[number];
export type Attraction = (typeof attractionsData)[number];

const DESTINATIONS = data as Destination[];
const ATTRACTIONS = attractionsData as Attraction[];

export type SortKey =
  | "popular"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "name-asc";

export interface DestinationFilters {
  search?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  activities?: string[];
  weather?: string[];
  durations?: string[];
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}

function matchesSearch(d: Destination, query: string) {
  const haystack = [
    d.name,
    d.country,
    d.region,
    d.tagline,
    d.description,
    ...(d.tags ?? []),
    ...(d.activities ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function applyFilters(items: Destination[], filters: DestinationFilters) {
  return items.filter((d) => {
    if (filters.search) {
      const q = filters.search.trim().toLowerCase();
      if (q && !matchesSearch(d, q)) return false;
    }
    if (filters.categories?.length && !filters.categories.includes(d.category)) {
      return false;
    }
    if (filters.minPrice !== undefined && d.pricePerNight < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && d.pricePerNight > filters.maxPrice) return false;
    if (filters.minRating !== undefined && d.rating < filters.minRating) return false;
    if (filters.activities?.length) {
      const have = (d.activities ?? []).map((a) => a.toLowerCase());
      const wanted = filters.activities.map((a) => a.toLowerCase());
      if (!wanted.some((a) => have.includes(a))) return false;
    }
    if (filters.weather?.length) {
      const condition = d.weather?.condition?.toLowerCase() ?? "";
      if (!filters.weather.map((w) => w.toLowerCase()).includes(condition)) return false;
    }
    if (filters.durations?.length && !filters.durations.includes(d.duration ?? "")) {
      return false;
    }
    return true;
  });
}

function applySort(items: Destination[], sort: SortKey = "popular") {
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
      return copy.sort((a, b) => {
        if (a.featured === b.featured) return b.reviewCount - a.reviewCount;
        return a.featured ? -1 : 1;
      });
  }
}

export async function listDestinations(
  filters: DestinationFilters = {},
): Promise<Paginated<Destination>> {
  return fakeRequest(() => {
    const filtered = applyFilters(DESTINATIONS, filters);
    const sorted = applySort(filtered, filters.sort);
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.max(1, Math.min(filters.pageSize ?? 12, 50));
    const start = (page - 1) * pageSize;
    return {
      items: sorted.slice(start, start + pageSize),
      total: sorted.length,
      page,
      pageSize,
    };
  });
}

export async function getFeaturedDestinations(limit = 6): Promise<Destination[]> {
  return fakeRequest(() =>
    DESTINATIONS.filter((d) => d.featured).slice(0, limit),
  );
}

export async function getDestinationBySlug(slug: string): Promise<Destination> {
  return fakeRequest(() => {
    const found = DESTINATIONS.find((d) => d.slug === slug);
    if (!found) notFound("Destination");
    return found;
  });
}

export async function getCategories(): Promise<string[]> {
  return fakeRequest(() => Array.from(new Set(DESTINATIONS.map((d) => d.category))));
}

export async function getAvailableActivities(): Promise<string[]> {
  return fakeRequest(() => {
    const set = new Set<string>();
    DESTINATIONS.forEach((d) => (d.activities ?? []).forEach((a) => set.add(a)));
    return Array.from(set).sort();
  });
}

export async function getRelatedDestinations(
  slug: string,
  limit = 3,
): Promise<Destination[]> {
  return fakeRequest(() => {
    const target = DESTINATIONS.find((d) => d.slug === slug);
    if (!target) return [];
    return DESTINATIONS.filter(
      (d) => d.slug !== slug && d.category === target.category,
    )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  });
}

export async function getAttractionsByDestination(
  destinationId: string,
): Promise<Attraction[]> {
  return fakeRequest(() =>
    ATTRACTIONS.filter((a) => a.destinationId === destinationId),
  );
}

export function getPriceRange() {
  const prices = DESTINATIONS.map((d) => d.pricePerNight);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function getWeatherConditions() {
  return Array.from(
    new Set(DESTINATIONS.map((d) => d.weather?.condition).filter(Boolean)),
  ) as string[];
}

export function getDurations() {
  return Array.from(
    new Set(DESTINATIONS.map((d) => d.duration).filter(Boolean)),
  ) as string[];
}

export async function getDestinationsByIds(ids: string[]): Promise<Destination[]> {
  return fakeRequest(() => DESTINATIONS.filter((d) => ids.includes(d.id)));
}
