"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { useDestinations } from "@/features/destinations";
import { useFavorites } from "@/features/favorites";
import { useAuthStore } from "@/stores";
import { SkeletonCard } from "@/components/ui/skeleton";
import { recommendDestinations } from "@/lib/ai/recommend";
import { formatMoney } from "@/lib/utils/currency";

export function PicksForYou() {
  const user = useAuthStore((s) => s.user);
  const favorites = useFavorites();
  const destinations = useDestinations({ pageSize: 50 });

  const favoriteIds = (favorites.data ?? [])
    .filter((f) => f.entityType === "destination")
    .map((f) => f.entityId);

  const picks = recommendDestinations({
    travelStyle: user?.preferences?.travelStyle ?? [],
    favoriteDestinationIds: favoriteIds,
    destinations: destinations.data?.items ?? [],
  });

  return (
    <section className="md:col-span-12 rounded-2xl border border-border bg-surface-elevated p-6 shadow-sm">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600">
            <Sparkles className="h-3.5 w-3.5" />
            Picked for you
          </p>
          <h2
            className="mt-1 text-xl font-semibold text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Inspired by your taste
          </h2>
        </div>
        <Link href="/explore" className="text-sm font-medium text-sky-600 hover:underline">
          Explore all
        </Link>
      </header>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.isPending ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : picks.length === 0 ? (
          <p className="text-sm text-text-secondary">Save destinations or set preferences to get suggestions.</p>
        ) : (
          picks.map(({ destination, reasons }) => (
            <Link
              key={destination.id}
              href={`/explore/${destination.slug}`}
              className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-3/2">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600">
                  {destination.category}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
                  {destination.name}
                </h3>
                <p className="mt-1 text-xs text-text-secondary">{destination.country}</p>
                {reasons.length > 0 && (
                  <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-sky-600">
                    <Sparkles className="h-3 w-3" />
                    {reasons[0]}
                  </p>
                )}
                <p className="mt-3 text-xs text-text-muted">
                  From {formatMoney(destination.pricePerNight, destination.currency)} / night
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
