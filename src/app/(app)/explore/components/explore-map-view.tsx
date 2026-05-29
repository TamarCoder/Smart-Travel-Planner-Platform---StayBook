"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Compass, Crosshair, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDestinationFilters, useDestinations } from "@/features/destinations";
import { LeafletMap, type LatLng, type MapMarker } from "@/components/maps";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useGeolocation } from "@/hooks/use-geolocation";
import { haversineDistance, formatDistance } from "@/lib/utils/distance";

const DEFAULT_CENTER: LatLng = [25, 10];

export function ExploreMapView() {
  const router = useRouter();
  const { filters, clearFilters } = useDestinationFilters();
  const { data, isPending, isError, refetch } = useDestinations({
    ...filters,
    pageSize: 50,
    page: 1,
  });
  const geo = useGeolocation();

  useEffect(() => {
    if (geo.status === "error" && geo.error) {
      toast.error(geo.error);
    }
  }, [geo.status, geo.error]);

  const userPosition = useMemo<LatLng | null>(
    () => (geo.position ? [geo.position.lat, geo.position.lng] : null),
    [geo.position],
  );

  const markers = useMemo<MapMarker[]>(() => {
    const list: MapMarker[] = (data?.items ?? [])
      .filter((d) => d.coordinates)
      .map((d) => {
        const position: LatLng = [d.coordinates!.lat, d.coordinates!.lng];
        const distance = geo.position
          ? formatDistance(haversineDistance(geo.position, d.coordinates!))
          : null;
        return {
          id: d.slug,
          position,
          title: d.name,
          description: distance ? `${d.country} · ${distance} away` : d.country,
          meta: `${formatPrice(d.pricePerNight, d.currency)} / night`,
          image: d.image,
          accent: d.featured ? "sky" : "navy",
          kind: "price",
          label: formatPriceShort(d.pricePerNight, d.currency),
        };
      });

    if (userPosition) {
      list.push({
        id: "user-location",
        position: userPosition,
        title: "You are here",
        description: "Approximate location from your browser",
        accent: "rose",
        kind: "dot",
      });
    }
    return list;
  }, [data, geo.position, userPosition]);

  if (isError) {
    return (
      <div className="flex h-[60vh] items-center justify-center rounded-2xl border border-border bg-surface">
        <EmptyState
          title="Could not load the map"
          description="Try refreshing the data."
          action={
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
            >
              Try again
            </button>
          }
        />
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex h-[60vh] items-center justify-center rounded-2xl border border-border bg-surface-muted">
        <Spinner className="h-6 w-6 text-sky-500" />
      </div>
    );
  }

  if (!markers.length) {
    return (
      <div className="flex h-[60vh] items-center justify-center rounded-2xl border border-border bg-surface">
        <EmptyState
          icon={<Compass className="h-6 w-6 text-sky-600" />}
          title="No destinations on the map"
          description="Adjust your filters to see destinations on the map."
          action={
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
            >
              Clear filters
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="h-[70vh] min-h-105 w-full">
        <LeafletMap
          center={markers[0]?.position ?? DEFAULT_CENTER}
          zoom={3}
          markers={markers}
          fitToMarkers={!userPosition}
          flyTo={userPosition}
          onMarkerClick={(slug) => {
            if (slug === "user-location") return;
            router.push(`/explore/${slug}`);
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => geo.request()}
        disabled={geo.status === "loading"}
        className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-xs font-medium text-text-primary shadow-lg ring-1 ring-border transition-transform hover:scale-105 disabled:opacity-60"
      >
        {geo.status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
        ) : (
          <Crosshair className="h-4 w-4 text-sky-600" />
        )}
        {geo.status === "success" ? "Recenter on me" : "Use my location"}
      </button>
    </div>
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
