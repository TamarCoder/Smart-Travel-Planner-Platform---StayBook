"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarRange, Plus } from "lucide-react";
import PlannerShell from "./components/shell";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useTrips } from "@/features/trips";
import { CreateTripDialog } from "../dashboard/components/create-trip-dialog";

export default function PlannerIndex() {
  const router = useRouter();
  const { data, isPending, isError, refetch } = useTrips();

  useEffect(() => {
    if (!data || data.length === 0) return;
    const first = data.find((t) => t.status === "draft" || t.status === "upcoming") ?? data[0];
    if (first) router.replace(`/planner/${first.id}`);
  }, [data, router]);

  return (
    <div>
      <PlannerShell />
      <main className="pt-20 pb-16 lg:pl-64">
        <div className="mx-auto w-full max-w-5xl px-4 md:px-10">
          <header className="mb-8">
            <p className="text-sm font-medium text-sky-600">Planner</p>
            <h1
              className="mt-2 text-3xl font-bold text-text-primary md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Pick a trip to plan
            </h1>
          </header>

          {isPending && (
            <div className="flex h-40 items-center justify-center">
              <Spinner className="h-6 w-6 text-sky-500" />
            </div>
          )}

          {isError && (
            <EmptyState
              title="Could not load your trips"
              action={
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
                >
                  Retry
                </button>
              }
            />
          )}

          {data && data.length === 0 && (
            <EmptyState
              icon={<CalendarRange className="h-6 w-6 text-sky-600" />}
              title="No trips yet"
              description="Create your first trip to start planning."
              action={
                <CreateTripDialog
                  trigger={
                    <button className="inline-flex items-center gap-2 rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800">
                      <Plus className="h-4 w-4" /> New trip
                    </button>
                  }
                />
              }
            />
          )}

          {data && data.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.map((trip) => (
                <Link
                  key={trip.id}
                  href={`/planner/${trip.id}`}
                  className="group relative flex overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-32 w-40 shrink-0">
                    <Image
                      src={trip.coverImage ?? "/assets/luxury_travel_planner_landing_page__img_03.png"}
                      alt={trip.title}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-sky-600">{trip.status}</p>
                    <h3 className="text-base font-semibold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
                      {trip.title}
                    </h3>
                    <p className="text-xs text-text-secondary">
                      {trip.startDate} → {trip.endDate}
                    </p>
                    <p className="mt-auto text-xs font-medium text-text-secondary">
                      {trip.nights} nights · {trip.itinerary.length} day plan
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
