"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useHotelFilters } from "@/features/hotels";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { HotelSortKey } from "@/lib/api/hotels";

const SORT_OPTIONS: { value: HotelSortKey; label: string }[] = [
  { value: "popular", label: "Most reviewed" },
  { value: "rating-desc", label: "Top rated" },
  { value: "price-asc", label: "Price · low to high" },
  { value: "price-desc", label: "Price · high to low" },
  { value: "name-asc", label: "Name · A to Z" },
];

interface BookingToolbarProps {
  total: number;
  onToggleFilters: () => void;
  activeFilterCount: number;
}

export function BookingToolbar({ total, onToggleFilters, activeFilterCount }: BookingToolbarProps) {
  const { filters, writeFilters } = useHotelFilters();
  const [search, setSearch] = useState(filters.search ?? "");
  const debounced = useDebouncedValue(search, 300);

  useEffect(() => {
    if ((filters.search ?? "") !== debounced) {
      writeFilters({ search: debounced || undefined }, { resetPage: true });
    }
  }, [debounced, filters.search, writeFilters]);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative max-w-xl flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search hotels, amenities, neighborhoods…"
          className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-10 text-sm outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 lg:justify-end">
        <button
          type="button"
          onClick={onToggleFilters}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-text-secondary sm:inline">
            {total} {total === 1 ? "stay" : "stays"}
          </span>
          <select
            value={filters.sort ?? "popular"}
            onChange={(e) => writeFilters({ sort: e.target.value as HotelSortKey }, { resetPage: true })}
            className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-medium text-text-primary outline-none transition-colors focus:border-sky-600"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
