"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CalendarDays } from "lucide-react";
import type { TripDay } from "@/lib/api/trips";
import { cn } from "@/lib/utils";
import { SortableActivity } from "./sortable-activity";

interface DayColumnProps {
  day: TripDay;
  dayIndex: number;
  tripId?: string;
}

export function DayColumn({ day, dayIndex, tripId }: DayColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `day-${dayIndex}`,
    data: { dayIndex, type: "day" },
  });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-border bg-surface-muted/40 p-5 transition-colors",
        isOver && "bg-sky-500/5 ring-2 ring-sky-500/40",
      )}
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-navy-950 text-sm font-bold text-white">
            {day.day}
          </span>
          <div>
            <p className="text-sm font-semibold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
              {day.title}
            </p>
            <p className="text-xs text-text-secondary">{formatDate(day.date)}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs text-text-muted">
          <CalendarDays className="h-3.5 w-3.5" />
          {day.activities.length} {day.activities.length === 1 ? "item" : "items"}
        </span>
      </header>

      <SortableContext
        items={day.activities.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {day.activities.map((activity) => (
            <SortableActivity
              key={activity.id}
              activity={activity}
              dayIndex={dayIndex}
              tripId={tripId}
            />
          ))}
          {day.activities.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-surface px-4 py-8 text-center text-xs text-text-muted">
              Drop activities here
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
}

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(new Date(date));
  } catch {
    return date;
  }
}
