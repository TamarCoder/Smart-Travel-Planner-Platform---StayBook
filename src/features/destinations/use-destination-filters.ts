"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { DestinationFilters, SortKey } from "@/lib/api/destinations";

const PARAMS = {
  search: "q",
  categories: "cat",
  minPrice: "min",
  maxPrice: "max",
  minRating: "r",
  activities: "act",
  durations: "dur",
  weather: "w",
  sort: "sort",
  page: "p",
} as const;

const SORTS: SortKey[] = [
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

function parseSort(value: string | null): SortKey | undefined {
  return SORTS.includes(value as SortKey) ? (value as SortKey) : undefined;
}

export function useDestinationFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: DestinationFilters = useMemo(
    () => ({
      search: searchParams.get(PARAMS.search) ?? undefined,
      categories: parseList(searchParams.get(PARAMS.categories)),
      minPrice: parseNumber(searchParams.get(PARAMS.minPrice)),
      maxPrice: parseNumber(searchParams.get(PARAMS.maxPrice)),
      minRating: parseNumber(searchParams.get(PARAMS.minRating)),
      activities: parseList(searchParams.get(PARAMS.activities)),
      durations: parseList(searchParams.get(PARAMS.durations)),
      weather: parseList(searchParams.get(PARAMS.weather)),
      sort: parseSort(searchParams.get(PARAMS.sort)),
      page: parseNumber(searchParams.get(PARAMS.page)) ?? 1,
      pageSize: 9,
    }),
    [searchParams],
  );

  const writeFilters = useCallback(
    (next: Partial<DestinationFilters>, options?: { resetPage?: boolean }) => {
      const params = new URLSearchParams(searchParams.toString());
      const merged: DestinationFilters = { ...filters, ...next };

      function setOrDelete(key: string, value: string | undefined) {
        if (!value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      setOrDelete(PARAMS.search, merged.search?.trim() || undefined);
      setOrDelete(PARAMS.categories, merged.categories?.length ? merged.categories.join(",") : undefined);
      setOrDelete(PARAMS.minPrice, merged.minPrice !== undefined ? String(merged.minPrice) : undefined);
      setOrDelete(PARAMS.maxPrice, merged.maxPrice !== undefined ? String(merged.maxPrice) : undefined);
      setOrDelete(PARAMS.minRating, merged.minRating !== undefined ? String(merged.minRating) : undefined);
      setOrDelete(PARAMS.activities, merged.activities?.length ? merged.activities.join(",") : undefined);
      setOrDelete(PARAMS.durations, merged.durations?.length ? merged.durations.join(",") : undefined);
      setOrDelete(PARAMS.weather, merged.weather?.length ? merged.weather.join(",") : undefined);
      setOrDelete(PARAMS.sort, merged.sort && merged.sort !== "popular" ? merged.sort : undefined);

      const page = options?.resetPage ? 1 : merged.page ?? 1;
      setOrDelete(PARAMS.page, page > 1 ? String(page) : undefined);

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [filters, pathname, router, searchParams],
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return { filters, writeFilters, clearFilters };
}

export type { SortKey };
