import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Sparkles } from "lucide-react";
import { FavoriteButton } from "@/components/shared/favorite-button";
import type { Destination } from "@/lib/api/destinations";

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const { slug, name, country, image, pricePerNight, currency, rating, reviewCount, tagline, featured } = destination;

  return (
    <Link
      href={`/explore/${slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <FavoriteButton
          entityType="destination"
          entityId={destination.id}
          className="absolute top-3 right-3"
          size="sm"
        />
        {featured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-navy-950 shadow-sm">
            <Sparkles className="h-3 w-3 text-sky-600" />
            Featured
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="truncate text-base font-semibold text-text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {name}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-600" />
              {country}
            </p>
          </div>
          <div className="text-right text-xs">
            <div className="flex items-center justify-end gap-1 font-semibold text-text-primary">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {rating.toFixed(2)}
            </div>
            <p className="text-text-muted">{reviewCount} reviews</p>
          </div>
        </div>

        <p className="mt-3 text-xs text-text-secondary line-clamp-2">{tagline}</p>

        <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
          <div className="text-xs text-text-muted">
            <span className="text-base font-bold text-text-primary">
              {formatPrice(pricePerNight, currency)}
            </span>
            <span> / night</span>
          </div>
          <span className="text-xs font-semibold text-sky-600 transition-transform group-hover:translate-x-0.5">
            View →
          </span>
        </div>
      </div>
    </Link>
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
