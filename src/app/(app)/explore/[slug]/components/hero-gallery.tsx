"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { cn } from "@/lib/utils";
import type { Destination } from "@/lib/api/destinations";

interface HeroGalleryProps {
  destination: Destination;
}

export function HeroGallery({ destination }: HeroGalleryProps) {
  const gallery = destination.gallery?.length ? destination.gallery : [destination.image];
  const [index, setIndex] = useState(0);

  function previous() {
    setIndex((i) => (i - 1 + gallery.length) % gallery.length);
  }
  function next() {
    setIndex((i) => (i + 1) % gallery.length);
  }

  return (
    <section className="relative overflow-hidden rounded-3xl">
      <div className="relative aspect-3/2 w-full md:aspect-21/9">
        <Image
          src={gallery[index]}
          alt={destination.name}
          fill
          priority={index === 0}
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={previous}
              className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text-primary shadow-md transition-transform hover:scale-105 md:flex"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text-primary shadow-md transition-transform hover:scale-105 md:flex"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <FavoriteButton
          entityType="destination"
          entityId={destination.id}
          className="absolute top-4 right-4"
        />

        <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-3 text-white md:bottom-8 md:left-10 md:right-10">
          <p className="text-xs font-medium uppercase tracking-widest text-white/80">
            {destination.region}
          </p>
          <h1
            className="text-3xl font-bold leading-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {destination.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {destination.country}
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {destination.rating.toFixed(2)} · {destination.reviewCount} reviews
            </span>
          </div>
        </div>
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 flex items-center gap-2">
          {gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "relative h-16 w-24 overflow-hidden rounded-xl border-2 transition-opacity",
                i === index ? "border-sky-600 opacity-100" : "border-transparent opacity-70 hover:opacity-100",
              )}
              aria-label={`Show image ${i + 1}`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
