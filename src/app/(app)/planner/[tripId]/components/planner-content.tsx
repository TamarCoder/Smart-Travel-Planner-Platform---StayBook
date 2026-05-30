"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Link from "next/link";
import { ArrowLeft, CalendarRange, Sparkles, Wallet } from "lucide-react";
import { toast } from "sonner";
import PlannerShell from "../../components/shell";
import { SortableActivity } from "./sortable-activity";
import { DayColumn } from "./day-column";
import { CalendarView } from "./calendar-view";
import { MapView } from "./map-view";
import { BudgetView } from "./budget-view";
import { PlannerViewToggle } from "./view-toggle";
import { useMoveActivity, usePlannerView, useReorderDay, useTrip } from "@/features/trips";
import { useTripRealtime } from "@/features/realtime";
import { PresenceStack } from "./presence-stack";
import { InviteDialog } from "./invite-dialog";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import type { TripActivity } from "@/lib/api/trips";

interface PlannerContentProps {
  tripId: string;
}

export function PlannerContent({ tripId }: PlannerContentProps) {
  useTripRealtime(tripId);
  const { data: trip, isPending, isError, refetch } = useTrip(tripId);
  const reorderDay = useReorderDay();
  const moveActivity = useMoveActivity();
  const { view } = usePlannerView();
  const [activeActivity, setActiveActivity] = useState<{ activity: TripActivity; dayIndex: number } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  if (isPending) {
    return (
      <div>
        <PlannerShell />
        <main className="pt-20 pb-16 lg:pl-64">
          <div className="flex h-[60vh] items-center justify-center">
            <Spinner className="h-6 w-6 text-sky-500" />
          </div>
        </main>
      </div>
    );
  }

  if (isError || !trip) {
    return (
      <div>
        <PlannerShell />
        <main className="pt-20 pb-16 lg:pl-64">
          <EmptyState
            className="mx-auto max-w-md"
            title="Trip not found"
            description="The trip you are looking for is no longer available."
            action={
              <Link
                href="/dashboard"
                className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
              >
                Back to dashboard
              </Link>
            }
          />
          <button type="button" hidden onClick={() => refetch()} />
        </main>
      </div>
    );
  }

  function findActivity(activityId: string) {
    for (let i = 0; i < trip!.itinerary.length; i++) {
      const day = trip!.itinerary[i];
      const idx = day.activities.findIndex((a) => a.id === activityId);
      if (idx >= 0) return { dayIndex: i, index: idx, activity: day.activities[idx] };
    }
    return null;
  }

  function handleDragStart(event: DragStartEvent) {
    const id = String(event.active.id);
    const found = findActivity(id);
    if (found) setActiveActivity({ activity: found.activity, dayIndex: found.dayIndex });
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveActivity(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const from = findActivity(activeId);
    if (!from) return;

    const overIsDay = overId.startsWith("day-");
    const targetDayIndex = overIsDay
      ? Number(overId.replace("day-", ""))
      : findActivity(overId)?.dayIndex ?? from.dayIndex;
    const targetDay = trip!.itinerary[targetDayIndex];
    if (!targetDay) return;

    if (from.dayIndex === targetDayIndex && !overIsDay) {
      const oldIndex = from.index;
      const newIndex = targetDay.activities.findIndex((a) => a.id === overId);
      if (newIndex < 0 || newIndex === oldIndex) return;
      const newOrder = arrayMove(targetDay.activities, oldIndex, newIndex).map((a) => a.id);
      reorderDay.mutate(
        { tripId: trip!.id, dayIndex: from.dayIndex, orderedIds: newOrder },
        { onError: (e) => toast.error(e.message) },
      );
      return;
    }

    const toIndex = overIsDay
      ? targetDay.activities.length
      : Math.max(0, targetDay.activities.findIndex((a) => a.id === overId));
    moveActivity.mutate(
      {
        tripId: trip!.id,
        activityId: activeId,
        fromDay: from.dayIndex,
        toDay: targetDayIndex,
        toIndex,
      },
      { onError: (e) => toast.error(e.message) },
    );
  }

  return (
    <div>
      <PlannerShell />
      <main className="pt-20 pb-16 lg:pl-64">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <header className="mt-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium text-sky-600">Itinerary</p>
              <h1
                className="mt-2 text-3xl font-bold text-text-primary md:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {trip.title}
              </h1>
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-text-secondary">
                <CalendarRange className="h-4 w-4" />
                {formatRange(trip.startDate, trip.endDate)} · {trip.nights} nights
              </p>
            </div>
            <div className="flex flex-col gap-3 text-right md:items-end">
              <PresenceStack tripId={tripId} />
              <div className="flex items-center gap-2">
                <InviteDialog tripId={trip.id} tripTitle={trip.title} />
                <PlannerViewToggle />
              </div>
              <div className="inline-flex items-center justify-end gap-2 text-sm text-text-secondary">
                <Wallet className="h-4 w-4 text-sky-600" />
                {formatCurrency(trip.spent)} of {formatCurrency(trip.totalBudget)}
              </div>
              <div className="inline-flex items-center justify-end gap-2 text-xs text-text-secondary">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Planning {trip.planningProgress}% complete
              </div>
            </div>
          </header>

          <div className="mt-8">
            {view === "calendar" ? (
              <CalendarView days={trip.itinerary} />
            ) : view === "map" ? (
              <MapView destinationSlug={trip.destination} days={trip.itinerary} />
            ) : view === "budget" ? (
              <BudgetView trip={trip} />
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={() => setActiveActivity(null)}
              >
                <div
                  className={cn(
                    "grid gap-6",
                    view === "timeline"
                      ? "grid-cols-1 mx-auto max-w-3xl"
                      : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3",
                  )}
                >
                  {trip.itinerary.map((day, idx) => (
                    <DayColumn key={day.day} day={day} dayIndex={idx} />
                  ))}
                </div>

                <DragOverlay>
                  {activeActivity ? (
                    <SortableActivity
                      activity={activeActivity.activity}
                      dayIndex={activeActivity.dayIndex}
                      overlay
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function formatRange(start: string, end: string) {
  try {
    const startD = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(start));
    const endD = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(end));
    return `${startD} → ${endD}`;
  } catch {
    return `${start} → ${end}`;
  }
}

function formatCurrency(amount: number) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `$${amount}`;
  }
}
