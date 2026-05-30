import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, CalendarX } from "lucide-react";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { formatMoney } from "@/lib/utils/currency";
import { getNights, getStayTotal, isHotelAvailable, type StayInput } from "@/lib/utils/availability";
import type { Hotel } from "@/lib/api/hotels";
import { cn } from "@/lib/utils";

interface HotelCardProps {
  hotel: Hotel;
  stay?: StayInput;
}

export default function HotelCard({ hotel, stay }: HotelCardProps) {
  const available = isHotelAvailable(hotel.id, stay?.checkIn, stay?.checkOut);
  const nights = stay?.checkIn && stay?.checkOut ? getNights(stay.checkIn, stay.checkOut) : 0;
  const total = nights > 0 ? getStayTotal(hotel.pricePerNight, nights) : 0;
  return (
    <Link
      href={`/booking/${hotel.id}`}
      aria-disabled={!available}
      className={cn(
        "group block overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        !available && "opacity-70",
      )}
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={hotel.image}
          alt={hotel.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <FavoriteButton entityType="hotel" entityId={hotel.id} className="absolute top-4 right-4" />
        {stay?.checkIn && stay?.checkOut && (
          <span
            className={cn(
              "absolute top-4 left-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold",
              available ? "bg-emerald-500/90 text-white" : "bg-rose-500/90 text-white",
            )}
          >
            {available ? "Available" : (
              <>
                <CalendarX className="h-3 w-3" />
                Sold out
              </>
            )}
          </span>
        )}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {hotel.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-medium text-navy-950 backdrop-blur"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600">
              {hotel.propertyType}
            </p>
            <h3
              className="mt-1 truncate text-base font-semibold text-text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {hotel.name}
            </h3>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-text-secondary">
              <MapPin className="h-3.5 w-3.5 text-sky-600" />
              {hotel.neighborhood}
            </p>
          </div>
          <div className="text-right text-xs">
            <div className="inline-flex items-center justify-end gap-1 font-semibold text-text-primary">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {hotel.rating.toFixed(2)}
            </div>
            <p className="text-text-muted">{hotel.reviewCount} reviews</p>
          </div>
        </div>

        <p className="mt-3 text-xs text-text-secondary line-clamp-2">{hotel.description}</p>

        <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
          <div className="text-xs text-text-muted">
            <span className="text-base font-bold text-text-primary">
              {formatMoney(hotel.pricePerNight, hotel.currency)}
            </span>
            <span> / night</span>
            {nights > 0 && (
              <p className="text-[11px] font-medium text-text-secondary">
                {nights} {nights === 1 ? "night" : "nights"} · {formatMoney(total, hotel.currency)} total
              </p>
            )}
          </div>
          <span className="text-xs font-semibold text-sky-600 transition-transform group-hover:translate-x-0.5">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
