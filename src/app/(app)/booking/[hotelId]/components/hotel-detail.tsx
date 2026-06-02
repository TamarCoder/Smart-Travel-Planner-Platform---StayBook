"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useHotel } from "@/features/hotels";
import { useHotelFilters } from "@/features/hotels";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { LeafletMap, type LatLng, type MapMarker } from "@/components/maps";
import { formatMoney } from "@/lib/utils/currency";
import BookingShell from "../../components/shell";
import { ReserveDialog } from "./reserve-dialog";
import { ReviewsSection } from "@/components/shared/reviews-section";

interface HotelDetailProps {
  hotelId: string;
}

export function HotelDetail({ hotelId }: HotelDetailProps) {
  const { stay } = useHotelFilters();
  const { data: hotel, isPending, isError, refetch } = useHotel(hotelId);

  if (isPending) {
    return (
      <div>
        <BookingShell />
        <main className="flex min-h-[60vh] items-center justify-center pt-20 lg:pl-64">
          <Spinner className="h-6 w-6 text-sky-500" />
        </main>
      </div>
    );
  }

  if (isError || !hotel) {
    return (
      <div>
        <BookingShell />
        <main className="pt-20 pb-16 lg:pl-64">
          <EmptyState
            className="mx-auto max-w-md"
            title="Hotel not available"
            description="We could not load this property."
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
        </main>
      </div>
    );
  }

  const gallery = hotel.gallery?.length ? hotel.gallery : [hotel.image];
  const center: LatLng = [hotel.coordinates.lat, hotel.coordinates.lng];
  const markers: MapMarker[] = [
    {
      id: hotel.id,
      position: center,
      title: hotel.name,
      description: hotel.neighborhood,
      image: hotel.image,
      meta: `${formatMoney(hotel.pricePerNight, hotel.currency)} / night`,
      accent: "navy",
      kind: "pin",
    },
  ];

  return (
    <div>
      <BookingShell />
      <main className="pt-20 pb-16 lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-10">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to results
          </Link>

          <header className="mt-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[3fr_1fr] md:gap-4">
              <div className="relative aspect-3/2 overflow-hidden rounded-3xl">
                <Image
                  src={gallery[0]}
                  alt={hotel.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 768px"
                  className="object-cover"
                />
                <FavoriteButton entityType="hotel" entityId={hotel.id} className="absolute top-4 right-4" />
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                {gallery.slice(1, 3).map((src) => (
                  <div key={src} className="relative aspect-3/2 overflow-hidden rounded-2xl">
                    <Image src={src} alt={hotel.name} fill sizes="320px" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </header>

          <section className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">{hotel.propertyType}</p>
                <h1
                  className="mt-2 text-3xl font-bold text-text-primary md:text-4xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {hotel.name}
                </h1>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin className="h-4 w-4 text-sky-600" />
                  {hotel.neighborhood}
                  <span className="text-text-muted">·</span>
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {hotel.rating.toFixed(2)} · {hotel.reviewCount} reviews
                </p>
              </div>

              <p className="text-sm leading-relaxed text-text-secondary md:text-base">{hotel.description}</p>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Highlights</h3>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {hotel.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-text-primary"
                    >
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Amenities</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {hotel.amenities.map((a) => (
                    <span key={a} className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">On the map</h3>
                <div className="mt-3 overflow-hidden rounded-2xl border border-border shadow-sm">
                  <div className="h-72 w-full">
                    <LeafletMap center={center} zoom={13} markers={markers} interactive />
                  </div>
                </div>
              </div>
            </div>

            <aside className="flex h-fit flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm lg:sticky lg:top-24">
              <div>
                <p className="text-xs uppercase tracking-wider text-text-muted">From</p>
                <p className="text-3xl font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
                  {formatMoney(hotel.pricePerNight, hotel.currency)}
                  <span className="ml-1 text-sm font-medium text-text-secondary">/ night</span>
                </p>
              </div>

              <ReserveDialog hotel={hotel} defaultStay={stay} />

              <p className="inline-flex items-center gap-2 text-xs text-text-secondary">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Free cancellation within 48 hours
              </p>
            </aside>
          </section>

          <section className="mt-12 flex flex-col gap-5">
            <header>
              <h3
                className="text-2xl font-bold text-text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Guest reviews
              </h3>
            </header>
            <ReviewsSection entityType="hotel" entityId={hotel.id} />
          </section>
        </div>
      </main>
    </div>
  );
}
