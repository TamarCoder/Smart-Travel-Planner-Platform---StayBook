"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useHotelFilters } from "@/features/hotels";
import {
  getHotelAmenities,
  getHotelNeighborhoods,
  getHotelPriceRange,
  getHotelPropertyTypes,
} from "@/lib/api/hotels";
import { cn } from "@/lib/utils";

const RATINGS = [4.9, 4.8, 4.5, 4.0];
const PRICE_RANGE = getHotelPriceRange();
const ALL_AMENITIES = getHotelAmenities();
const ALL_PROPERTY_TYPES = getHotelPropertyTypes();

interface BookingFiltersPanelProps {
  open: boolean;
  onClose: () => void;
}

export function BookingFiltersPanel({ open, onClose }: BookingFiltersPanelProps) {
  return (
    <>
      {open && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] overflow-y-auto border-l border-border bg-surface px-5 py-6 shadow-xl transition-transform duration-300 lg:static lg:z-auto lg:w-full lg:max-w-none lg:translate-x-0 lg:rounded-2xl lg:border lg:px-6 lg:py-6 lg:shadow-sm",
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between lg:hidden">
          <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-text-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>
        <FilterContents onApply={onClose} />
      </aside>
    </>
  );
}

function FilterContents({ onApply }: { onApply: () => void }) {
  const { filters, writeFilters, clearFilters } = useHotelFilters();

  const neighborhoods = useMemo(
    () => getHotelNeighborhoods(filters.destinationId),
    [filters.destinationId],
  );

  function toggleArray(
    key: "neighborhoods" | "amenities" | "propertyTypes",
    value: string,
  ) {
    const current = filters[key] ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    writeFilters({ [key]: next }, { resetPage: true });
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-7">
      <PriceFilter
        min={PRICE_RANGE.min}
        max={PRICE_RANGE.max}
        valueMin={filters.minPrice ?? PRICE_RANGE.min}
        valueMax={filters.maxPrice ?? PRICE_RANGE.max}
        onChange={(min, max) =>
          writeFilters(
            {
              minPrice: min === PRICE_RANGE.min ? undefined : min,
              maxPrice: max === PRICE_RANGE.max ? undefined : max,
            },
            { resetPage: true },
          )
        }
      />

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Rating</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {RATINGS.map((value) => {
            const active = filters.minRating === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() =>
                  writeFilters({ minRating: active ? undefined : value }, { resetPage: true })
                }
                className={chip(active)}
              >
                {value.toFixed(1)}+ ★
              </button>
            );
          })}
        </div>
      </div>

      <ChipGroup
        title="Property type"
        items={ALL_PROPERTY_TYPES}
        selected={filters.propertyTypes ?? []}
        onToggle={(v) => toggleArray("propertyTypes", v)}
      />

      <ChipGroup
        title="Neighborhood"
        items={neighborhoods}
        selected={filters.neighborhoods ?? []}
        onToggle={(v) => toggleArray("neighborhoods", v)}
      />

      <ChipGroup
        title="Amenities"
        items={ALL_AMENITIES}
        selected={filters.amenities ?? []}
        onToggle={(v) => toggleArray("amenities", v)}
      />

      <div className="flex flex-col gap-2 border-t border-border pt-5 lg:flex-row lg:justify-between">
        <button
          type="button"
          onClick={() => {
            clearFilters();
            onApply();
          }}
          className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onApply}
          className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 lg:hidden"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

function ChipGroup({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => {
          const active = selected.includes(item);
          return (
            <button key={item} type="button" onClick={() => onToggle(item)} className={chip(active)}>
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PriceFilter({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
}: {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
}) {
  const [localMin, setLocalMin] = useState(valueMin);
  const [localMax, setLocalMax] = useState(valueMax);

  function commit(nextMin = localMin, nextMax = localMax) {
    const clampedMin = Math.max(min, Math.min(nextMin, nextMax - 100));
    const clampedMax = Math.min(max, Math.max(nextMax, nextMin + 100));
    onChange(clampedMin, clampedMax);
  }

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Price per night</h3>
      <div className="mt-3 flex items-center gap-3 text-xs text-text-secondary">
        <span>${localMin.toLocaleString()}</span>
        <div className="flex-1 border-t border-dashed border-border" />
        <span>${localMax.toLocaleString()}</span>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={50}
          value={localMin}
          onChange={(e) => setLocalMin(Number(e.target.value))}
          onMouseUp={() => commit()}
          onTouchEnd={() => commit()}
          className="accent-sky-600"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={50}
          value={localMax}
          onChange={(e) => setLocalMax(Number(e.target.value))}
          onMouseUp={() => commit()}
          onTouchEnd={() => commit()}
          className="accent-sky-600"
        />
      </div>
    </div>
  );
}

function chip(active: boolean) {
  return cn(
    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
    active
      ? "border-sky-600 bg-sky-500/10 text-sky-700"
      : "border-border text-text-secondary hover:border-border-strong",
  );
}
