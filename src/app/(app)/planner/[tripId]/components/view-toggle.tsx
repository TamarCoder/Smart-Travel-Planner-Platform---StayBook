"use client";

import { LayoutGrid, ListOrdered, CalendarDays, Map, Wallet } from "lucide-react";
import { usePlannerView, type PlannerView } from "@/features/trips";
import { cn } from "@/lib/utils";

const OPTIONS: { value: PlannerView; label: string; icon: typeof LayoutGrid }[] = [
  { value: "kanban", label: "Board", icon: LayoutGrid },
  { value: "timeline", label: "Timeline", icon: ListOrdered },
  { value: "calendar", label: "Calendar", icon: CalendarDays },
  { value: "map", label: "Map", icon: Map },
  { value: "budget", label: "Budget", icon: Wallet },
];

export function PlannerViewToggle() {
  const { view, setView } = usePlannerView();
  return (
    <div className="inline-flex rounded-xl border border-border bg-surface p-1">
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = view === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setView(value)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-navy-950 text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
