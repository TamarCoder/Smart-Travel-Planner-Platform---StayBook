"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { CalendarRange, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useCreateBooking } from "@/features/bookings";
import { useTrips } from "@/features/trips";
import { reserveSchema, type ReserveInput } from "@/lib/validations/booking";
import { getNights, getStayTotal, isHotelAvailable } from "@/lib/utils/availability";
import { formatMoney } from "@/lib/utils/currency";
import type { Hotel } from "@/lib/api/hotels";

interface ReserveDialogProps {
  hotel: Hotel;
  defaultStay?: { checkIn?: string; checkOut?: string; guests?: number; rooms?: number };
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export function ReserveDialog({ hotel, defaultStay }: ReserveDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const trips = useTrips();
  const createBooking = useCreateBooking();

  const {
    control,
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReserveInput>({
    resolver: zodResolver(reserveSchema),
    defaultValues: {
      checkIn: defaultStay?.checkIn ?? "",
      checkOut: defaultStay?.checkOut ?? "",
      guests: defaultStay?.guests ?? 2,
      rooms: defaultStay?.rooms ?? 1,
      tripId: undefined,
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      checkIn: defaultStay?.checkIn ?? "",
      checkOut: defaultStay?.checkOut ?? "",
      guests: defaultStay?.guests ?? 2,
      rooms: defaultStay?.rooms ?? 1,
      tripId: undefined,
    });
  }, [open, defaultStay, reset]);

  const checkIn = useWatch({ control, name: "checkIn" });
  const checkOut = useWatch({ control, name: "checkOut" });
  const rooms = useWatch({ control, name: "rooms" });

  const range: DateRange | undefined =
    checkIn || checkOut
      ? {
          from: checkIn ? new Date(checkIn) : undefined,
          to: checkOut ? new Date(checkOut) : undefined,
        }
      : undefined;

  const nights = checkIn && checkOut ? getNights(checkIn, checkOut) : 0;
  const total = nights > 0 ? getStayTotal(hotel.pricePerNight, nights) * (rooms ?? 1) : 0;
  const available = isHotelAvailable(hotel.id, checkIn, checkOut);

  function handleRangeSelect(next: DateRange | undefined) {
    setValue("checkIn", next?.from ? toIsoDate(next.from) : "", { shouldValidate: true });
    setValue("checkOut", next?.to ? toIsoDate(next.to) : "", { shouldValidate: true });
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      const booking = await createBooking.mutateAsync({
        hotelId: hotel.id,
        tripId: values.tripId,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        guests: Number(values.guests),
        rooms: Number(values.rooms),
      });
      toast.success("Booking confirmed");
      setOpen(false);
      router.push(`/dashboard/bookings?highlight=${booking.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not reserve");
    }
  });

  const busy = isSubmitting || createBooking.isPending;
  const canSubmit = available && nights > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
        >
          Reserve
        </button>
      </DialogTrigger>
      <DialogContent size="md" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-display)" }}>{hotel.name}</DialogTitle>
          <DialogDescription>{hotel.neighborhood} · {hotel.propertyType}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
          <Controller
            control={control}
            name="checkIn"
            render={() => (
              <section className="rounded-2xl border border-border bg-surface px-3 py-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <CalendarRange className="h-4 w-4 text-sky-600" />
                    Stay dates
                  </div>
                  <p className="text-xs text-text-secondary">
                    {range?.from
                      ? `${formatDate(range.from)} ${range.to ? `→ ${formatDate(range.to)}` : ""}`
                      : "Pick dates"}
                  </p>
                </div>
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={handleRangeSelect}
                  numberOfMonths={1}
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
                {(errors.checkIn || errors.checkOut) && (
                  <p className="mt-2 text-xs text-error-dark">
                    {errors.checkIn?.message ?? errors.checkOut?.message}
                  </p>
                )}
              </section>
            )}
          />

          <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="guests" className="text-xs font-medium text-text-secondary">Guests</label>
              <input
                id="guests"
                type="number"
                min={1}
                max={12}
                {...register("guests", { valueAsNumber: true })}
                className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-sky-600"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rooms" className="text-xs font-medium text-text-secondary">Rooms</label>
              <input
                id="rooms"
                type="number"
                min={1}
                max={8}
                {...register("rooms", { valueAsNumber: true })}
                className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-sky-600"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tripId" className="text-xs font-medium text-text-secondary">Trip (optional)</label>
              <select
                id="tripId"
                {...register("tripId")}
                className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-sky-600"
                disabled={trips.isPending}
              >
                <option value="">No trip</option>
                {(trips.data ?? []).map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface-muted/50 p-4 text-sm">
            <div className="flex items-center justify-between text-text-secondary">
              <span>{nights} {nights === 1 ? "night" : "nights"} × {formatMoney(hotel.pricePerNight, hotel.currency)}</span>
              <span className="font-semibold text-text-primary">{formatMoney(nights * hotel.pricePerNight, hotel.currency)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-text-secondary">
              <span>{rooms} {rooms === 1 ? "room" : "rooms"}</span>
              <span>×{rooms}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-base">
              <span className="font-semibold text-text-primary">Total</span>
              <span className="font-bold text-text-primary">{formatMoney(total, hotel.currency)}</span>
            </div>
            <p className="mt-3 inline-flex items-center gap-2 text-xs text-text-secondary">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Free cancellation within 48 hours · No charge until check-in
            </p>
            {!available && nights > 0 && (
              <p className="mt-2 text-xs font-medium text-rose-600">
                These dates are sold out. Try a different range.
              </p>
            )}
          </section>

          <DialogFooter>
            <DialogClose asChild>
              <button
                type="button"
                className="rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-hover"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={busy || !canSubmit}
              className="inline-flex items-center gap-2 rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
            >
              {busy ? <Spinner className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              Confirm reservation
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
