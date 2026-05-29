"use client";

import Image from "next/image";
import { Clock, Star } from "lucide-react";
import { useDestinationAttractions } from "@/features/destinations";
import { SkeletonCard } from "@/components/ui/skeleton";

interface AttractionsSectionProps {
  destinationId: string;
}

export function AttractionsSection({ destinationId }: AttractionsSectionProps) {
  const { data, isPending } = useDestinationAttractions(destinationId);

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface-muted p-8 text-center text-sm text-text-secondary">
        No curated attractions yet for this destination.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((attraction) => (
        <article
          key={attraction.id}
          className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        >
          <div className="relative aspect-3/2">
            <Image
              src={attraction.image}
              alt={attraction.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-navy-950">
              {attraction.category}
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div>
              <h3 className="text-base font-semibold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
                {attraction.name}
              </h3>
              <p className="mt-1 text-xs text-text-secondary line-clamp-3">{attraction.description}</p>
            </div>
            <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-text-secondary">
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {attraction.rating.toFixed(1)} · {attraction.reviewCount}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {attraction.duration}
              </span>
              <span className="font-semibold text-text-primary">
                {attraction.priceFrom === 0 ? "Free" : `$${attraction.priceFrom}`}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
