"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { HotelFilters, HotelSortKey } from "@/lib/api/hotels";

const PARAMS = {
  search: "q",
  destinationId: "dest",
  neighborhoods: "n",
  amenities: "a",
  propertyTypes: "pt",
  minPrice: "min",
  maxPrice: "max",
  minRating: "r",
  sort: "sort",
  page: "p",
  checkIn: "in",
  checkOut: "out",
  guests: "g",
  rooms: "rms",
} as const;

const SORTS: HotelSortKey[] = [
  "popular",
  "price-asc",
  "price-desc",
  "rating-desc",
  "name-asc",
];

function parseList(value: string | null) {
  if (!value) return undefined;
  const items = value.split(",").map((s) => s.trim()).filter(Boolean);
  return items.length ? items : undefined;
}

function parseNumber(value: string | null) {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function parseSort(value: string | null): HotelSortKey | undefined {
  return SORTS.includes(value as HotelSortKey) ? (value as HotelSortKey) : undefined;
}

export interface HotelStayParams {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
}

export function useHotelFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: HotelFilters = useMemo(
    () => ({
      search: searchParams.get(PARAMS.search) ?? undefined,
      destinationId: searchParams.get(PARAMS.destinationId) ?? undefined,
      neighborhoods: parseList(searchParams.get(PARAMS.neighborhoods)),
      amenities: parseList(searchParams.get(PARAMS.amenities)),
      propertyTypes: parseList(searchParams.get(PARAMS.propertyTypes)),
      minPrice: parseNumber(searchParams.get(PARAMS.minPrice)),
      maxPrice: parseNumber(searchParams.get(PARAMS.maxPrice)),
      minRating: parseNumber(searchParams.get(PARAMS.minRating)),
      sort: parseSort(searchParams.get(PARAMS.sort)),
      page: parseNumber(searchParams.get(PARAMS.page)) ?? 1,
      pageSize: 9,
    }),
    [searchParams],
  );

  const stay: HotelStayParams = useMemo(
    () => ({
      checkIn: searchParams.get(PARAMS.checkIn) ?? undefined,
      checkOut: searchParams.get(PARAMS.checkOut) ?? undefined,
      guests: parseNumber(searchParams.get(PARAMS.guests)),
      rooms: parseNumber(searchParams.get(PARAMS.rooms)),
    }),
    [searchParams],
  );

  const writeFilters = useCallback(
    (
      next: Partial<HotelFilters> & Partial<HotelStayParams>,
      options?: { resetPage?: boolean },
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      function setOrDelete(key: string, value: string | undefined) {
        if (!value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      const merged = { ...filters, ...stay, ...next };

      setOrDelete(PARAMS.search, merged.search?.trim() || undefined);
      setOrDelete(PARAMS.destinationId, merged.destinationId || undefined);
      setOrDelete(PARAMS.neighborhoods, merged.neighborhoods?.length ? merged.neighborhoods.join(",") : undefined);
      setOrDelete(PARAMS.amenities, merged.amenities?.length ? merged.amenities.join(",") : undefined);
      setOrDelete(PARAMS.propertyTypes, merged.propertyTypes?.length ? merged.propertyTypes.join(",") : undefined);
      setOrDelete(PARAMS.minPrice, merged.minPrice !== undefined ? String(merged.minPrice) : undefined);
      setOrDelete(PARAMS.maxPrice, merged.maxPrice !== undefined ? String(merged.maxPrice) : undefined);
      setOrDelete(PARAMS.minRating, merged.minRating !== undefined ? String(merged.minRating) : undefined);
      setOrDelete(PARAMS.sort, merged.sort && merged.sort !== "popular" ? merged.sort : undefined);
      setOrDelete(PARAMS.checkIn, merged.checkIn);
      setOrDelete(PARAMS.checkOut, merged.checkOut);
      setOrDelete(PARAMS.guests, merged.guests ? String(merged.guests) : undefined);
      setOrDelete(PARAMS.rooms, merged.rooms ? String(merged.rooms) : undefined);

      const page = options?.resetPage ? 1 : merged.page ?? 1;
      setOrDelete(PARAMS.page, page > 1 ? String(page) : undefined);

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [filters, stay, pathname, router, searchParams],
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return { filters, stay, writeFilters, clearFilters };
}
