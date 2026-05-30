"use client";

import { Globe2 } from "lucide-react";
import { useDestinations } from "@/features/destinations";
import { useHotelFilters } from "@/features/hotels";
import { cn } from "@/lib/utils";

export function DestinationTabs() {
  const { filters, writeFilters } = useHotelFilters();
  const destinations = useDestinations({ pageSize: 50 });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => writeFilters({ destinationId: undefined }, { resetPage: true })}
        className={chip(filters.destinationId == null)}
      >
        <Globe2 className="h-3.5 w-3.5" />
        All destinations
      </button>
      {(destinations.data?.items ?? []).map((d) => (
        <button
          key={d.id}
          type="button"
          onClick={() => writeFilters({ destinationId: d.id }, { resetPage: true })}
          className={chip(filters.destinationId === d.id)}
        >
          {d.name}
        </button>
      ))}
    </div>
  );
}

function chip(active: boolean) {
  return cn(
    "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
    active
      ? "border-navy-950 bg-navy-950 text-white"
      : "border-border bg-surface text-text-secondary hover:border-border-strong",
  );
}
