"use client";

import { useMemo, useState } from "react";
import { useDestination } from "@/features/destinations";
import {
  LeafletMap,
  routeColorForIndex,
  type LatLng,
  type MapMarker,
  type MapRoute,
} from "@/components/maps";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { TripActivity, TripDay } from "@/lib/api/trips";

interface MapViewProps {
  destinationSlug: string;
  days: TripDay[];
}

function syntheticPosition(seed: string, center: LatLng, ordinal: number): LatLng {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const angle = ((ordinal + (hash % 30)) * 137.5 * Math.PI) / 180;
  const radius = 0.012 + (ordinal * 0.004 + ((hash >>> 0) % 50) / 5000);
  return [center[0] + radius * Math.cos(angle), center[1] + radius * Math.sin(angle)];
}

function activityPosition(activity: TripActivity, center: LatLng, ordinal: number): LatLng {
  if (activity.coordinates) {
    return [activity.coordinates.lat, activity.coordinates.lng];
  }
  return syntheticPosition(activity.id, center, ordinal);
}

export function MapView({ destinationSlug, days }: MapViewProps) {
  const destination = useDestination(destinationSlug);
  const [activeDay, setActiveDay] = useState<number | "all">("all");

  const center: LatLng = useMemo(() => {
    const coords = destination.data?.coordinates;
    return coords ? [coords.lat, coords.lng] : [0, 0];
  }, [destination.data]);

  const { markers, routes } = useMemo(() => {
    const allMarkers: MapMarker[] = [];
    const allRoutes: MapRoute[] = [];

    days.forEach((day, dayIdx) => {
      if (activeDay !== "all" && activeDay !== dayIdx) return;
      const color = routeColorForIndex(dayIdx);
      const positions: LatLng[] = day.activities.map((a, idx) =>
        activityPosition(a, center, idx + 1),
      );

      if (positions.length > 1) {
        allRoutes.push({
          id: `route-day-${dayIdx}`,
          positions,
          color,
          label: `${day.title}`,
        });
      }

      day.activities.forEach((activity, idx) => {
        allMarkers.push({
          id: `${dayIdx}-${activity.id}`,
          position: positions[idx],
          title: activity.title,
          description: `${day.title} · ${activity.type}`,
          meta: activity.time,
          accent: dayAccent(dayIdx),
          kind: "pin",
          label: String(idx + 1),
        });
      });
    });

    if (destination.data?.coordinates) {
      allMarkers.unshift({
        id: "trip-destination",
        position: center,
        title: destination.data.name,
        description: destination.data.tagline,
        accent: "navy",
        kind: "pin",
      });
    }

    return { markers: allMarkers, routes: allRoutes };
  }, [days, activeDay, center, destination.data]);

  if (destination.isPending) {
    return (
      <div className="flex h-[60vh] items-center justify-center rounded-2xl border border-border bg-surface-muted">
        <Spinner className="h-6 w-6 text-sky-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveDay("all")}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            activeDay === "all"
              ? "border-navy-950 bg-navy-950 text-white"
              : "border-border bg-surface text-text-secondary hover:border-border-strong",
          )}
        >
          All days
        </button>
        {days.map((day, idx) => {
          const color = routeColorForIndex(idx);
          const isActive = activeDay === idx;
          return (
            <button
              key={day.day}
              type="button"
              onClick={() => setActiveDay(idx)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "border-transparent text-white"
                  : "border-border bg-surface text-text-secondary hover:border-border-strong",
              )}
              style={isActive ? { backgroundColor: color } : undefined}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              Day {day.day}
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="h-[65vh] min-h-105 w-full">
          <LeafletMap
            center={center}
            zoom={11}
            markers={markers}
            routes={routes}
            fitToMarkers={markers.length > 0}
          />
        </div>
      </div>
    </div>
  );
}

function dayAccent(dayIdx: number): MapMarker["accent"] {
  const palette: NonNullable<MapMarker["accent"]>[] = ["sky", "emerald", "amber", "violet", "rose"];
  return palette[dayIdx % palette.length];
}
