"use client";

import { useState } from "react";
import { MapPin, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useDestinations } from "@/features/destinations";
import { useUpdateTrip } from "@/features/trips";
import type { Trip } from "@/lib/api/trips";

export function DestinationsBar({ trip }: { trip: Trip }) {
  const [open, setOpen] = useState(false);
  const { data } = useDestinations({ pageSize: 50 });
  const update = useUpdateTrip();

  const all = data?.items ?? [];
  const slugs =
    trip.destinations && trip.destinations.length > 0
      ? trip.destinations
      : [trip.destination];
  const nameForSlug = (slug: string) => all.find((d) => d.slug === slug)?.name ?? slug;
  const available = all.filter((d) => !slugs.includes(d.slug));

  function setDestinations(next: string[]) {
    update.mutate(
      { id: trip.id, patch: { destinations: next } },
      { onError: () => toast.error("Could not update destinations") },
    );
  }

  function add(slug: string) {
    if (slugs.includes(slug)) return;
    setDestinations([...slugs, slug]);
    setOpen(false);
  }

  function remove(slug: string) {
    if (slugs.length <= 1) return;
    setDestinations(slugs.filter((s) => s !== slug));
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <MapPin className="h-4 w-4 shrink-0 text-secondary" />
      {slugs.map((slug) => (
        <span
          key={slug}
          className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-text-primary"
        >
          {nameForSlug(slug)}
          {slugs.length > 1 && (
            <button
              type="button"
              onClick={() => remove(slug)}
              aria-label={`Remove ${nameForSlug(slug)}`}
              className="text-text-muted transition-colors hover:text-error"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          disabled={available.length === 0}
          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-muted disabled:opacity-50"
        >
          <Plus className="h-3 w-3" /> Add stop
        </button>
        {open && available.length > 0 && (
          <div className="absolute z-20 mt-2 max-h-64 w-56 overflow-auto rounded-xl border border-border bg-surface p-1 shadow-xl">
            {available.map((d) => (
              <button
                key={d.slug}
                type="button"
                onClick={() => add(d.slug)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-text-primary transition-colors hover:bg-surface-muted"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-secondary" />
                {d.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
