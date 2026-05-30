"use client";

import { ChevronLeft, ChevronRight, RotateCw, Hotel } from "lucide-react";
import { useHotelFilters, useHotels } from "@/features/hotels";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import HotelCard from "./hotel-card";

export function BookingResults() {
  const { filters, writeFilters, clearFilters } = useHotelFilters();
  const query = useHotels(filters);

  if (query.isError) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <p className="text-sm font-medium text-text-primary">Something went wrong loading hotels.</p>
        <button
          type="button"
          onClick={() => query.refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-navy-950 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
        >
          <RotateCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  const items = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const pageSize = filters.pageSize ?? 9;
  const page = filters.page ?? 1;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  if (query.isPending) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        icon={<Hotel className="h-6 w-6 text-sky-600" />}
        title="No stays match your filters"
        description="Try widening the price range or removing some amenities."
        action={
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Clear filters
          </button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>

      {pages > 1 && (
        <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
          <button
            type="button"
            onClick={() => writeFilters({ page: page - 1 })}
            disabled={page <= 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-hover disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-3 text-sm font-medium text-text-secondary">
            Page {page} of {pages}
          </span>
          <button
            type="button"
            onClick={() => writeFilters({ page: page + 1 })}
            disabled={page >= pages}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-hover disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
