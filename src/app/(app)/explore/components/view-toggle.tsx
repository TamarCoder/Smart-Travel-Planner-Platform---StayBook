"use client";

import { LayoutGrid, Map } from "lucide-react";
import { useExploreView, type ExploreView } from "@/features/destinations";
import { cn } from "@/lib/utils";

const OPTIONS: { value: ExploreView; label: string; icon: typeof Map }[] = [
  { value: "grid", label: "Grid", icon: LayoutGrid },
  { value: "map", label: "Map", icon: Map },
];

export function ViewToggle() {
  const { view, setView } = useExploreView();

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
