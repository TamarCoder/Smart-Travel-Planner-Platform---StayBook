"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useActivities, useCategories, useDestinationFilters } from "@/features/destinations";
import { getDurations, getPriceRange, getWeatherConditions } from "@/lib/api/destinations";
import { cn } from "@/lib/utils";

const RATINGS = [4.9, 4.7, 4.5, 4.0];
const PRICE_RANGE = getPriceRange();
const WEATHER = getWeatherConditions();
const DURATIONS = getDurations();

interface ExploreFiltersProps {
  open: boolean;
  onClose: () => void;
}

export function ExploreFilters({ open, onClose }: ExploreFiltersProps) {
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
        <FilterPanels onApply={onClose} />
      </aside>
    </>
  );
}

function FilterPanels({ onApply }: { onApply: () => void }) {
  const { filters, writeFilters, clearFilters } = useDestinationFilters();
  const categoriesQuery = useCategories();
  const activitiesQuery = useActivities();

  function toggleArray(key: "categories" | "activities" | "durations" | "weather", value: string) {
    const current = filters[key] ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    writeFilters({ [key]: next }, { resetPage: true });
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-7">
      <FilterGroup
        title="Category"
        items={categoriesQuery.data ?? []}
        selected={filters.categories ?? []}
        onToggle={(v) => toggleArray("categories", v)}
      />

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
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-sky-600 bg-sky-500/10 text-sky-700"
                    : "border-border text-text-secondary hover:border-border-strong",
                )}
              >
                {value.toFixed(1)}+ ★
              </button>
            );
          })}
        </div>
      </div>

      <FilterGroup
        title="Weather"
        items={WEATHER}
        selected={filters.weather ?? []}
        onToggle={(v) => toggleArray("weather", v)}
      />

      <FilterGroup
        title="Duration"
        items={DURATIONS}
        selected={filters.durations ?? []}
        onToggle={(v) => toggleArray("durations", v)}
      />

      <FilterGroup
        title="Activities"
        items={activitiesQuery.data ?? []}
        selected={filters.activities ?? []}
        onToggle={(v) => toggleArray("activities", v)}
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

interface FilterGroupProps {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

function FilterGroup({ title, items, selected, onToggle }: FilterGroupProps) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => {
          const active = selected.includes(item);
          return (
            <button
              key={item}
              type="button"
              onClick={() => onToggle(item)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "border-sky-600 bg-sky-500/10 text-sky-700"
                  : "border-border text-text-secondary hover:border-border-strong",
              )}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface PriceFilterProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
}

function PriceFilter({ min, max, valueMin, valueMax, onChange }: PriceFilterProps) {
  const [localMin, setLocalMin] = useState(valueMin);
  const [localMax, setLocalMax] = useState(valueMax);

  function commit(nextMin = localMin, nextMax = localMax) {
    const clampedMin = Math.max(min, Math.min(nextMin, nextMax - 100));
    const clampedMax = Math.min(max, Math.max(nextMax, nextMin + 100));
    onChange(clampedMin, clampedMax);
  }

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        Price per night
      </h3>
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
