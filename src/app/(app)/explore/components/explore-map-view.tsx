"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Compass } from "lucide-react";
import { useDestinationFilters, useDestinations } from "@/features/destinations";
import { LeafletMap, type LatLng, type MapMarker } from "@/components/maps";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";

const DEFAULT_CENTER: LatLng = [25, 10];

export function ExploreMapView() {
  const router = useRouter();
  const { filters, clearFilters } = useDestinationFilters();
  const { data, isPending, isError, refetch } = useDestinations({
    ...filters,
    pageSize: 50,
    page: 1,
  });

  const markers = useMemo<MapMarker[]>(() => {
    if (!data?.items) return [];
    return data.items
      .filter((d) => d.coordinates)
      .map((d) => ({
        id: d.slug,
        position: [d.coordinates!.lat, d.coordinates!.lng] as LatLng,
        title: d.name,
        description: `${d.country} · ${formatPrice(d.pricePerNight, d.currency)} / night`,
      }));
  }, [data]);

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
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="h-[70vh] min-h-[420px] w-full">
        <LeafletMap
          center={markers[0]?.position ?? DEFAULT_CENTER}
          zoom={3}
          markers={markers}
          fitToMarkers
          onMarkerClick={(slug) => router.push(`/explore/${slug}`)}
        />
      </div>
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
