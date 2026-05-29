"use client";

import { useMemo } from "react";
import { useDestinationAttractions } from "@/features/destinations";
import { LeafletMap, type LatLng, type MapMarker } from "@/components/maps";
import { Spinner } from "@/components/ui/spinner";
import type { Destination } from "@/lib/api/destinations";

interface DestinationMapProps {
  destination: Destination;
}

export function DestinationMap({ destination }: DestinationMapProps) {
  const { data: attractions, isPending } = useDestinationAttractions(destination.id);

  const markers = useMemo<MapMarker[]>(() => {
    const list: MapMarker[] = [];
    if (destination.coordinates) {
      list.push({
        id: `dest-${destination.id}`,
        position: [destination.coordinates.lat, destination.coordinates.lng],
        title: destination.name,
        description: destination.tagline,
      });
    }
    (attractions ?? []).forEach((a) => {
      if (!a.coordinates) return;
      list.push({
        id: `atr-${a.id}`,
        position: [a.coordinates.lat, a.coordinates.lng],
        title: a.name,
        description: a.category,
      });
    });
    return list;
  }, [destination, attractions]);

  const center: LatLng = destination.coordinates
    ? [destination.coordinates.lat, destination.coordinates.lng]
    : [0, 0];

  return (
    <section className="flex flex-col gap-5">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h3
            className="text-2xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            On the map
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            {destination.name} and {markers.length > 1 ? markers.length - 1 : 0} nearby attractions.
          </p>
        </div>
        {isPending && <Spinner className="h-4 w-4 text-sky-500" />}
      </header>

      <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
        <div className="h-[420px] w-full">
          <LeafletMap center={center} zoom={9} markers={markers} fitToMarkers />
        </div>
      </div>
    </section>
  );
}
