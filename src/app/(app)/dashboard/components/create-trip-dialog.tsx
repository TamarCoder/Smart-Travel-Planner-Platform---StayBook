"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { CalendarRange, Plus } from "lucide-react";
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
import { useDestinations } from "@/features/destinations";
import { useCreateTrip } from "@/features/trips";
import { createTripSchema, type CreateTripFormInput } from "@/lib/validations/trip";
import { cn } from "@/lib/utils";

interface CreateTripDialogProps {
  trigger?: React.ReactNode;
}

export function CreateTripDialog({ trigger }: CreateTripDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const destinations = useDestinations({ pageSize: 50 });
  const createTrip = useCreateTrip();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CreateTripFormInput>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      title: "",
      destination: "",
      startDate: "",
      endDate: "",
      totalBudget: 4000,
      coverImage: undefined,
    },
  });

  const selectedDestinationSlug = useWatch({ control, name: "destination" });
  const startDateValue = useWatch({ control, name: "startDate" });
  const endDateValue = useWatch({ control, name: "endDate" });

  const dateRange: DateRange | undefined =
    startDateValue || endDateValue
      ? {
          from: startDateValue ? new Date(startDateValue) : undefined,
          to: endDateValue ? new Date(endDateValue) : undefined,
        }
      : undefined;

  function handleSelectDestination(slug: string, name: string, image?: string) {
    setValue("destination", slug, { shouldValidate: true });
    setValue("coverImage", image, { shouldValidate: false });
    if (!getValues("title")) {
      setValue("title", `${name} trip`, { shouldValidate: true });
    }
  }

  function handleSelectRange(range: DateRange | undefined) {
    setValue("startDate", range?.from ? toIsoDate(range.from) : "", { shouldValidate: true });
    setValue("endDate", range?.to ? toIsoDate(range.to) : "", { shouldValidate: true });
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      const trip = await createTrip.mutateAsync({
        title: values.title,
        destination: values.destination,
        startDate: values.startDate,
        endDate: values.endDate,
        totalBudget: Number(values.totalBudget),
        coverImage: values.coverImage,
      });
      toast.success("Trip created");
      reset();
      setOpen(false);
      router.push(`/planner/${trip.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not create trip. Try again.";
      toast.error(message);
    }
  });

  const busy = isSubmitting || createTrip.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" /> New trip
          </button>
        )}
      </DialogTrigger>

      <DialogContent size="lg" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-display)" }}>Plan a new trip</DialogTitle>
          <DialogDescription>
            Pick a destination, set your dates and budget. You can refine the rest later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-text-primary">Destination</p>
              {errors.destination && (
                <p className="text-xs text-error-dark">{errors.destination.message}</p>
              )}
            </div>

            {destinations.isPending ? (
              <div className="flex h-32 items-center justify-center rounded-xl border border-border bg-surface-muted">
                <Spinner className="h-5 w-5 text-sky-500" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {destinations.data?.items.map((d) => {
                  const active = selectedDestinationSlug === d.slug;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleSelectDestination(d.slug, d.name, d.image)}
                      className={cn(
                        "group relative overflow-hidden rounded-xl border bg-surface text-left shadow-sm transition-all",
                        active
                          ? "border-sky-600 ring-2 ring-sky-500/30"
                          : "border-border hover:-translate-y-0.5 hover:shadow-md",
                      )}
                    >
                      <div className="relative aspect-4/3">
                        <Image
                          src={d.image}
                          alt={d.name}
                          fill
                          sizes="200px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {active && (
                          <span className="absolute inset-x-0 bottom-0 bg-sky-600/90 py-1 text-center text-[10px] font-semibold uppercase tracking-wider text-white">
                            Selected
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="truncate text-xs font-semibold text-text-primary">{d.name}</p>
                        <p className="text-[11px] text-text-secondary">{d.country}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm font-medium text-text-primary">
                Trip title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Honeymoon in Greece"
                aria-invalid={!!errors.title}
                {...register("title")}
                className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 aria-invalid:border-error"
              />
              {errors.title && (
                <p className="text-xs text-error-dark">{errors.title.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="totalBudget" className="text-sm font-medium text-text-primary">
                Budget (USD)
              </label>
              <input
                id="totalBudget"
                type="number"
                min={0}
                step={100}
                aria-invalid={!!errors.totalBudget}
                {...register("totalBudget", { valueAsNumber: true })}
                className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 aria-invalid:border-error"
              />
              {errors.totalBudget && (
                <p className="text-xs text-error-dark">{errors.totalBudget.message}</p>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarRange className="h-4 w-4 text-sky-600" />
                <p className="text-sm font-semibold text-text-primary">Dates</p>
              </div>
              <p className="text-xs text-text-secondary">
                {dateRange?.from
                  ? `${formatDate(dateRange.from)} ${dateRange.to ? `→ ${formatDate(dateRange.to)}` : ""}`
                  : "Pick a start and return date"}
              </p>
            </div>
            <Controller
              control={control}
              name="startDate"
              render={() => (
                <div className="rounded-2xl border border-border bg-surface px-2 py-3">
                  <DayPicker
                    mode="range"
                    selected={dateRange}
                    onSelect={handleSelectRange}
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
                </div>
              )}
            />
            {(errors.startDate || errors.endDate) && (
              <p className="text-xs text-error-dark">
                {errors.startDate?.message ?? errors.endDate?.message}
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
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
            >
              {busy ? <Spinner className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              Create trip
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}
