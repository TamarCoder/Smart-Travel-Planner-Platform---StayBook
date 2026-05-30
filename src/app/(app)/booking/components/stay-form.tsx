"use client";

import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { CalendarDays, Minus, Plus, Users } from "lucide-react";
import { useHotelFilters } from "@/features/hotels";
import { describeStay } from "@/lib/utils/availability";
import { cn } from "@/lib/utils";

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

export function StayForm() {
  const { stay, writeFilters } = useHotelFilters();
  const [open, setOpen] = useState(false);

  const range: DateRange | undefined =
    stay.checkIn || stay.checkOut
      ? {
          from: stay.checkIn ? new Date(stay.checkIn) : undefined,
          to: stay.checkOut ? new Date(stay.checkOut) : undefined,
        }
      : undefined;

  const guests = stay.guests ?? 2;
  const rooms = stay.rooms ?? 1;

  function handleRangeSelect(next: DateRange | undefined) {
    writeFilters(
      {
        checkIn: next?.from ? toIsoDate(next.from) : undefined,
        checkOut: next?.to ? toIsoDate(next.to) : undefined,
      },
      { resetPage: true },
    );
  }

  function bump(key: "guests" | "rooms", delta: number) {
    const current = key === "guests" ? guests : rooms;
    const next = Math.max(1, Math.min(12, current + delta));
    writeFilters({ [key]: next });
  }

  return (
    <div className="relative">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm md:flex-row md:items-center">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm hover:bg-surface-hover"
        >
          <CalendarDays className="h-4 w-4 text-sky-600" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Stay</p>
            <p className="truncate font-medium text-text-primary">
              {range?.from
                ? `${formatDate(range.from)}${range.to ? ` → ${formatDate(range.to)}` : ""}`
                : "Pick dates"}
            </p>
          </div>
        </button>

        <Counter
          icon={<Users className="h-4 w-4 text-sky-600" />}
          label="Guests"
          value={guests}
          onIncrement={() => bump("guests", 1)}
          onDecrement={() => bump("guests", -1)}
        />

        <Counter
          label="Rooms"
          value={rooms}
          onIncrement={() => bump("rooms", 1)}
          onDecrement={() => bump("rooms", -1)}
        />
      </div>

      <p className="mt-2 text-xs text-text-secondary">{describeStay(stay)}</p>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close calendar"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default"
          />
          <div className="absolute top-full left-0 z-40 mt-2 max-w-full rounded-2xl border border-border bg-surface p-3 shadow-xl">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={handleRangeSelect}
              numberOfMonths={2}
              pagedNavigation
              disabled={{ before: new Date() }}
              classNames={{
                day_button: "rounded-full px-2 py-1 text-sm hover:bg-sky-500/10",
                selected: "bg-sky-600 text-white hover:bg-sky-600",
                range_start: "bg-sky-600 text-white",
                range_end: "bg-sky-600 text-white",
                range_middle: "bg-sky-500/10 text-text-primary",
                today: "font-bold text-sky-600",
              }}
            />
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-navy-950 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-800"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface CounterProps {
  icon?: React.ReactNode;
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

function Counter({ icon, label, value, onIncrement, onDecrement }: CounterProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5 md:w-auto">
      {icon}
      <div className="flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
        <p className="text-sm font-medium text-text-primary">{value}</p>
      </div>
      <div className="flex items-center gap-1">
        <CounterButton onClick={onDecrement} aria-label={`Decrease ${label}`}>
          <Minus className="h-3.5 w-3.5" />
        </CounterButton>
        <CounterButton onClick={onIncrement} aria-label={`Increase ${label}`}>
          <Plus className="h-3.5 w-3.5" />
        </CounterButton>
      </div>
    </div>
  );
}

function CounterButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-text-secondary hover:bg-surface-hover",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
