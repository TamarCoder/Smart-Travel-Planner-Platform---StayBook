"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDestinationAttractions } from "@/features/destinations";
import { useHotelsByDestination } from "@/features/hotels";
import { LeafletMap, type LatLng, type MapMarker } from "@/components/maps";
import { Spinner } from "@/components/ui/spinner";
import type { Destination } from "@/lib/api/destinations";

interface DestinationMapProps {
  destination: Destination;
}

export function DestinationMap({ destination }: DestinationMapProps) {
  const router = useRouter();
  const { data: attractions, isPending } = useDestinationAttractions(destination.id);
  const { data: hotels } = useHotelsByDestination(destination.id);

  const markers = useMemo<MapMarker[]>(() => {
    const list: MapMarker[] = [];
    if (destination.coordinates) {
      list.push({
        id: `dest-${destination.id}`,
        position: [destination.coordinates.lat, destination.coordinates.lng],
        title: destination.name,
        description: destination.tagline,
        image: destination.image,
        accent: "navy",
        kind: "pin",
      });
    }
    (attractions ?? []).forEach((a) => {
      if (!a.coordinates) return;
      list.push({
        id: `atr-${a.id}`,
        position: [a.coordinates.lat, a.coordinates.lng],
        title: a.name,
        description: a.category,
        image: a.image,
        meta: a.priceFrom === 0 ? "Free" : `From $${a.priceFrom}`,
        accent: "sky",
        kind: "pin",
      });
    });
    (hotels ?? []).forEach((h) => {
      if (!h.coordinates) return;
      list.push({
        id: `hotel-${h.id}`,
        position: [h.coordinates.lat, h.coordinates.lng],
        title: h.name,
        description: h.neighborhood,
        image: h.image,
        meta: `from ${formatPrice(h.pricePerNight, h.currency)} / night`,
        accent: "navy",
        kind: "price",
        label: formatPriceShort(h.pricePerNight, h.currency),
      });
    });
    return list;
  }, [destination, attractions, hotels]);

  const hotelCount = hotels?.length ?? 0;
  const attractionCount = attractions?.length ?? 0;

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
            {destination.name} · {attractionCount} attractions · {hotelCount} stays
          </p>
        </div>
        {isPending && <Spinner className="h-4 w-4 text-sky-500" />}
      </header>

      <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
        <div className="h-105 w-full">
          <LeafletMap
            center={center}
            zoom={9}
            markers={markers}
            fitToMarkers
            onMarkerClick={(id) => {
              if (id.startsWith("hotel-")) {
                router.push(`/booking/${id.slice("hotel-".length)}`);
              }
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-primary-container" /> Stays
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-secondary" /> Attractions
        </span>
      </div>
    </section>
  );
}

function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

function formatPriceShort(amount: number, currency: string) {
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "";
  if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return `${symbol}${Math.round(amount)}`;
}
