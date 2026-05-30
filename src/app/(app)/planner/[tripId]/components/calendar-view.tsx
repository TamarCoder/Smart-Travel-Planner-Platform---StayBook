"use client";

import { CalendarDays } from "lucide-react";
import type { TripDay } from "@/lib/api/trips";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarViewProps {
  days: TripDay[];
}

export function CalendarView({ days }: CalendarViewProps) {
  if (!days.length) return null;
  const first = new Date(days[0].date);
  const padStart = first.getDay();

  const cells = [
    ...Array.from({ length: padStart }, (_, i) => ({ kind: "empty" as const, key: `pad-${i}` })),
    ...days.map((d) => ({ kind: "day" as const, key: d.day, day: d })),
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="mb-3 grid grid-cols-7 gap-2 text-center text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {cells.map((cell) => {
          if (cell.kind === "empty") {
            return <div key={cell.key} className="aspect-square rounded-xl bg-surface-muted/30" />;
          }
          const date = new Date(cell.day.date);
          const isToday = isSameDay(date, new Date());
          return (
            <div
              key={cell.day.day}
              className="group flex aspect-square flex-col gap-1 rounded-xl border border-border bg-surface p-2 transition-colors hover:border-sky-500/50"
            >
              <div className="flex items-center justify-between text-[10px] font-medium uppercase text-text-muted">
                <span>Day {cell.day.day}</span>
                <span className={isToday ? "rounded-full bg-sky-600 px-1.5 py-0.5 text-white" : ""}>
                  {date.getDate()}
                </span>
              </div>
              {cell.day.activities.slice(0, 2).map((a) => (
                <p
                  key={a.id}
                  className="truncate rounded bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-medium text-sky-700"
                >
                  {a.title}
                </p>
              ))}
              {cell.day.activities.length > 2 && (
                <p className="text-[10px] text-text-secondary">
                  +{cell.day.activities.length - 2} more
                </p>
              )}
              {cell.day.activities.length === 0 && (
                <span className="mt-auto inline-flex items-center gap-1 text-[10px] text-text-muted">
                  <CalendarDays className="h-3 w-3" />
                  Free
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
