"use client";

import { ChevronLeft, ChevronRight, RotateCw, Compass } from "lucide-react";
import { useDestinations, useDestinationFilters } from "@/features/destinations";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { FadeInList } from "@/components/shared/fade-in";
import { DestinationCard } from "./destination-card";

export function ExploreResults() {
  const { filters, writeFilters, clearFilters } = useDestinationFilters();
  const query = useDestinations(filters);

  if (query.isError) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <p className="text-sm font-medium text-text-primary">Something went wrong loading destinations.</p>
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
        icon={<Compass className="h-6 w-6 text-sky-600" />}
        title="No destinations match your filters"
        description="Try widening the price range, dropping a category, or clearing all filters."
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
      <FadeInList className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </FadeInList>

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
