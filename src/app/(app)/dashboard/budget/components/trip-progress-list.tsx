"use client";

import Link from "next/link";
import type { DbTrip } from "@/lib/api/db";
import { convert, formatMoney } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";

interface TripProgressListProps {
  trips: DbTrip[];
  currency: string;
}

export function TripProgressList({ trips, currency }: TripProgressListProps) {
  if (trips.length === 0) return null;
  return (
    <ul className="flex flex-col gap-3">
      {trips.map((trip) => {
        const spent = convert(trip.spent, "USD", currency);
        const budget = convert(trip.totalBudget, "USD", currency);
        const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
        return (
          <li key={trip.id}>
            <Link
              href={`/planner/${trip.id}?view=budget`}
              className="block rounded-2xl border border-border bg-surface px-4 py-3 transition-colors hover:bg-surface-hover"
            >
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-text-primary">{trip.title}</p>
                  <p className="text-xs text-text-secondary capitalize">{trip.status} · {trip.nights} nights</p>
                </div>
                <p className="text-xs text-text-secondary">
                  {formatMoney(spent, currency)} / {formatMoney(budget, currency)}
                </p>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    pct >= 100 ? "bg-rose-500" : pct >= 80 ? "bg-amber-500" : "bg-sky-500",
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}