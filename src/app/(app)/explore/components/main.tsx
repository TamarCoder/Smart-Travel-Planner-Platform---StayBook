"use client";

import { useMemo, useState } from "react";
import { useDestinationFilters, useDestinations } from "@/features/destinations";
import { ExploreToolbar } from "./explore-toolbar";
import { ExploreFilters } from "./explore-filters";
import { ExploreResults } from "./explore-results";

export default function ExploreMain() {
  const { filters } = useDestinationFilters();
  const query = useDestinations(filters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.categories?.length) n += filters.categories.length;
    if (filters.activities?.length) n += filters.activities.length;
    if (filters.weather?.length) n += filters.weather.length;
    if (filters.durations?.length) n += filters.durations.length;
    if (filters.minPrice !== undefined) n += 1;
    if (filters.maxPrice !== undefined) n += 1;
    if (filters.minRating !== undefined) n += 1;
    return n;
  }, [filters]);

  return (
    <main className="pt-20 pb-16 lg:pl-64">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-10">
        <header className="mb-6 flex flex-col gap-2">
          <p className="text-sm font-medium text-sky-600">Explore</p>
          <h1
            className="text-3xl font-bold text-text-primary md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Find your next escape
          </h1>
          <p className="max-w-2xl text-sm text-text-secondary">
            Browse hand-picked destinations and refine by climate, budget, and the
            kind of trip you have in mind.
          </p>
        </header>

        <div className="mb-8">
          <ExploreToolbar
            total={query.data?.total ?? 0}
            onToggleFilters={() => setFiltersOpen(true)}
            activeFilterCount={activeFilterCount}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <ExploreFilters open={false} onClose={() => setFiltersOpen(false)} />
            </div>
          </div>

          <div className="lg:hidden">
            <ExploreFilters open={filtersOpen} onClose={() => setFiltersOpen(false)} />
          </div>

          <ExploreResults />
        </div>
      </div>
    </main>
  );
}
