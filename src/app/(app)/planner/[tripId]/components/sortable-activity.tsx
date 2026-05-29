"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plane, Car, Hotel, Utensils, Map, Sparkles, Sun, Clock } from "lucide-react";
import type { TripActivity } from "@/lib/api/trips";
import { cn } from "@/lib/utils";

const ICONS: Record<TripActivity["type"], typeof Plane> = {
  flight: Plane,
  transfer: Car,
  hotel: Hotel,
  activity: Sparkles,
  dining: Utensils,
  spa: Sun,
  tour: Map,
  note: Sparkles,
};

const STATUS_BADGE: Record<NonNullable<TripActivity["status"]>, string> = {
  confirmed: "bg-emerald-500/15 text-emerald-700",
  pending: "bg-amber-500/15 text-amber-700",
  cancelled: "bg-rose-500/15 text-rose-700",
};

interface SortableActivityProps {
  activity: TripActivity;
  dayIndex: number;
  overlay?: boolean;
}

export function SortableActivity({ activity, dayIndex, overlay }: SortableActivityProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: activity.id,
    data: { dayIndex, type: "activity" },
  });

  const Icon = ICONS[activity.type] ?? Sparkles;
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm transition-shadow",
        isDragging && "opacity-40",
        overlay && "shadow-xl ring-2 ring-sky-500/40",
      )}
    >
      <button
        type="button"
        aria-label="Drag activity"
        className="mt-1 cursor-grab text-text-muted hover:text-text-secondary active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {activity.time && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-text-secondary">
              <Clock className="h-3 w-3" />
              {activity.time}
            </span>
          )}
          {activity.status && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                STATUS_BADGE[activity.status],
              )}
            >
              {activity.status}
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-sm font-semibold text-text-primary">
          {activity.title}
        </p>
        {activity.detail && (
          <p className="mt-0.5 truncate text-xs text-text-secondary">{activity.detail}</p>
        )}
      </div>
    </div>
  );
}
