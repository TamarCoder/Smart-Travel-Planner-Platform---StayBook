"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { useFeaturedDestinations } from "@/features/destinations";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export function DestinationsSection() {
  const { data, isPending, isError, refetch } = useFeaturedDestinations(6);

  return (
    <section id="destinations" className="py-12 md:py-16 px-4 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-14 gap-4">
          <div>
            <h2
              className="font-bold text-text-primary mb-2 md:mb-3"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.375rem, 3vw, 2rem)",
                lineHeight: "1.25",
              }}
            >
              Curated Destinations
            </h2>
            <p
              className="text-sm md:text-base text-text-secondary leading-relaxed"
              style={{ maxWidth: "34rem" }}
            >
              Our team of curators hand-selects every property and experience to
              ensure your journey is nothing short of extraordinary.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-text-muted flex items-center justify-center hover:bg-sky-600/5 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-text-secondary" />
            </button>
            <button
              className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-text-muted flex items-center justify-center hover:bg-sky-600/5 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-text-secondary" />
            </button>
          </div>
        </div>

        {isPending && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} className="aspect-3/4" />
            ))}
          </div>
        )}

        {isError && (
          <EmptyState
            icon={<Compass className="h-6 w-6 text-sky-600" />}
            title="We couldn't load destinations"
            description="Refresh to try again."
            action={
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
              >
                Retry
              </button>
            }
          />
        )}

        {data && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            {data.map((d) => (
              <Link
                key={d.id}
                href={`/explore/${d.slug}`}
                className="group cursor-pointer"
              >
                <div className="aspect-3/4 rounded-2xl overflow-hidden mb-4 md:mb-6 relative">
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-surface-elevated backdrop-blur-xl border border-border px-3 py-1.5 rounded-full text-xs font-semibold text-text-primary shadow-sm">
                    from {formatPrice(d.pricePerNight, d.currency)}/night
                  </div>
                </div>
                <h3
                  className="font-semibold text-text-primary mb-1"
                  style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 2vw, 1.125rem)" }}
                >
                  {d.name}
                </h3>
                <p className="text-sm text-text-secondary flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                  {d.country}
                </p>
              </Link>
            ))}
          </div>
        )}
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
