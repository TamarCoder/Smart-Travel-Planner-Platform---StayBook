"use client";

import Link from "next/link";
import Image from "next/image";
import { useQueries } from "@tanstack/react-query";
import { Bookmark, BedDouble, MapPin } from "lucide-react";
import { useFavorites } from "@/features/favorites";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { getDestinationsByIds } from "@/lib/api/destinations";
import { getHotelsByIds } from "@/lib/api/hotels";
import { destinationsKeys } from "@/features/destinations";
import { cn } from "@/lib/utils";

type Tab = "destinations" | "hotels";

interface SavedGridProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function SavedGrid({ activeTab, onTabChange }: SavedGridProps) {
  const favorites = useFavorites();

  const destinationIds = (favorites.data ?? [])
    .filter((f) => f.entityType === "destination")
    .map((f) => f.entityId);
  const hotelIds = (favorites.data ?? [])
    .filter((f) => f.entityType === "hotel")
    .map((f) => f.entityId);

  const [destinationsQuery, hotelsQuery] = useQueries({
    queries: [
      {
        queryKey: [...destinationsKeys.all, "by-ids", destinationIds] as const,
        queryFn: () => getDestinationsByIds(destinationIds),
        enabled: destinationIds.length > 0,
        staleTime: 30_000,
      },
      {
        queryKey: ["hotels", "by-ids", hotelIds] as const,
        queryFn: () => getHotelsByIds(hotelIds),
        enabled: hotelIds.length > 0,
        staleTime: 30_000,
      },
    ],
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 border-b border-border">
        <TabButton
          active={activeTab === "destinations"}
          count={destinationIds.length}
          onClick={() => onTabChange("destinations")}
        >
          Destinations
        </TabButton>
        <TabButton
          active={activeTab === "hotels"}
          count={hotelIds.length}
          onClick={() => onTabChange("hotels")}
        >
          Hotels
        </TabButton>
      </div>

      {activeTab === "destinations" && (
        <SavedList
          loading={favorites.isPending || destinationsQuery.isPending}
          empty={!destinationIds.length}
          emptyIcon={<Bookmark className="h-6 w-6 text-sky-600" />}
          emptyTitle="No saved destinations yet"
          emptyDescription="Tap the heart on any destination to keep it within reach."
          emptyCta={
            <Link
              href="/explore"
              className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
            >
              Browse destinations
            </Link>
          }
        >
          {destinationsQuery.data?.map((d) => (
            <Link
              key={d.id}
              href={`/explore/${d.slug}`}
              className="group relative flex overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-32 w-36 shrink-0">
                <Image
                  src={d.image}
                  alt={d.name}
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium text-sky-600">{d.category}</p>
                  <FavoriteButton entityType="destination" entityId={d.id} size="sm" />
                </div>
                <h3 className="text-base font-semibold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
                  {d.name}
                </h3>
                <p className="inline-flex items-center gap-1 text-xs text-text-secondary">
                  <MapPin className="h-3.5 w-3.5 text-sky-600" /> {d.country}
                </p>
                <p className="mt-auto text-xs font-semibold text-text-primary">
                  {formatPrice(d.pricePerNight, d.currency)} / night
                </p>
              </div>
            </Link>
          ))}
        </SavedList>
      )}

      {activeTab === "hotels" && (
        <SavedList
          loading={favorites.isPending || hotelsQuery.isPending}
          empty={!hotelIds.length}
          emptyIcon={<BedDouble className="h-6 w-6 text-sky-600" />}
          emptyTitle="No saved stays yet"
          emptyDescription="Save hotels you love from the booking screen for one-tap planning."
          emptyCta={
            <Link
              href="/booking"
              className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
            >
              Find a stay
            </Link>
          }
        >
          {hotelsQuery.data?.map((h) => (
            <div
              key={h.id}
              className="group relative flex overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
            >
              <div className="relative h-32 w-36 shrink-0">
                <Image src={h.image} alt={h.name} fill sizes="144px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium text-sky-600">{h.neighborhood}</p>
                  <FavoriteButton entityType="hotel" entityId={h.id} size="sm" />
                </div>
                <h3 className="text-base font-semibold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
                  {h.name}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-2">{h.description}</p>
                <p className="mt-auto text-xs font-semibold text-text-primary">
                  {formatPrice(h.pricePerNight, h.currency)} / night
                </p>
              </div>
            </div>
          ))}
        </SavedList>
      )}
    </div>
  );
}

interface SavedListProps {
  loading: boolean;
  empty: boolean;
  emptyIcon: React.ReactNode;
  emptyTitle: string;
  emptyDescription: string;
  emptyCta: React.ReactNode;
  children?: React.ReactNode;
}

function SavedList({
  loading,
  empty,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyCta,
  children,
}: SavedListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (empty) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyCta}
      />
    );
  }

  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>;
}

function TabButton({
  children,
  active,
  count,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative -mb-px inline-flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
        active
          ? "border-sky-600 text-text-primary"
          : "border-transparent text-text-secondary hover:text-text-primary",
      )}
    >
      {children}
      <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
        {count}
      </span>
    </button>
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
