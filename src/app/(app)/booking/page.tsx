"use client";

import { useMemo, useState } from "react";
import { Building2, Compass, Bus } from "lucide-react";
import { useHotelFilters, useHotels } from "@/features/hotels";
import BookingShell from "./components/shell";
import { BookingToolbar } from "./components/booking-toolbar";
import { BookingFiltersPanel } from "./components/booking-filters-panel";
import { BookingResults } from "./components/booking-results";
import { DestinationTabs } from "./components/destination-tabs";
import { StayForm } from "./components/stay-form";
import { ExperiencesTransport } from "./components/experiences-transport";
import { cn } from "@/lib/utils";

type BookingTab = "stays" | "experience" | "transport";

const TABS: { key: BookingTab; label: string; icon: typeof Building2 }[] = [
  { key: "stays", label: "Stays", icon: Building2 },
  { key: "experience", label: "Experiences", icon: Compass },
  { key: "transport", label: "Transport", icon: Bus },
];

export default function BookingPage() {
  const { filters } = useHotelFilters();
  const query = useHotels(filters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [tab, setTab] = useState<BookingTab>("stays");

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.neighborhoods?.length) n += filters.neighborhoods.length;
    if (filters.amenities?.length) n += filters.amenities.length;
    if (filters.propertyTypes?.length) n += filters.propertyTypes.length;
    if (filters.minPrice !== undefined) n += 1;
    if (filters.maxPrice !== undefined) n += 1;
    if (filters.minRating !== undefined) n += 1;
    if (filters.destinationId) n += 1;
    return n;
  }, [filters]);

  return (
    <div>
      <BookingShell />
      <main className="pt-20 pb-16 lg:pl-64">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-10">
          <header className="mb-6 flex flex-col gap-2">
            <p className="text-sm font-medium text-sky-600">Booking</p>
            <h1
              className="text-3xl font-bold text-text-primary md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Find your sanctuary
            </h1>
            <p className="max-w-2xl text-sm text-text-secondary">
              Curated stays, experiences and transport from the world&rsquo;s most coveted destinations.
            </p>
          </header>

          <div className="mb-8 inline-flex rounded-full border border-border bg-surface p-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  tab === key
                    ? "bg-primary-container text-white"
                    : "text-text-secondary hover:text-text-primary",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {tab === "stays" ? (
            <>
              <div className="mb-6">
                <DestinationTabs />
              </div>

              <div className="mb-6">
                <StayForm />
              </div>

              <div className="mb-8">
                <BookingToolbar
                  total={query.data?.total ?? 0}
                  onToggleFilters={() => setFiltersOpen(true)}
                  activeFilterCount={activeFilterCount}
                />
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
                <div className="hidden lg:block">
                  <div className="sticky top-24">
                    <BookingFiltersPanel open={false} onClose={() => setFiltersOpen(false)} />
                  </div>
                </div>

                <div className="lg:hidden">
                  <BookingFiltersPanel open={filtersOpen} onClose={() => setFiltersOpen(false)} />
                </div>

                <BookingResults />
              </div>
            </>
          ) : (
            <ExperiencesTransport kind={tab} />
          )}
        </div>
      </main>
    </div>
  );
}
