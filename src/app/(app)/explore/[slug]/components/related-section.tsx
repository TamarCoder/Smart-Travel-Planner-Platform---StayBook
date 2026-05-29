"use client";

import { useRelatedDestinations } from "@/features/destinations";
import { DestinationCard } from "../../components/destination-card";
import { SkeletonCard } from "@/components/ui/skeleton";

interface RelatedSectionProps {
  slug: string;
}

export function RelatedSection({ slug }: RelatedSectionProps) {
  const { data, isPending } = useRelatedDestinations(slug, 3);

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!data?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((destination) => (
        <DestinationCard key={destination.id} destination={destination} />
      ))}
    </div>
  );
}
