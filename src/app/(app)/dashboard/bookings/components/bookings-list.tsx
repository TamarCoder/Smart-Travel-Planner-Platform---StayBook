"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { CalendarRange, MapPin, Star, Ban, BedDouble, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useBookings, useCancelBooking, bookingsKeys } from "@/features/bookings";
import { getHotelsByIds } from "@/lib/api/hotels";
import { hotelsKeys } from "@/features/hotels";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { formatMoney } from "@/lib/utils/currency";
import { getNights } from "@/lib/utils/availability";
import { cn } from "@/lib/utils";
import type { Booking } from "@/lib/api/bookings";

type Tab = "upcoming" | "past" | "cancelled";

function classify(booking: Booking): Tab {
  if (booking.status === "cancelled") return "cancelled";
  const checkIn = new Date(booking.checkIn);
  return checkIn.getTime() >= Date.now() ? "upcoming" : "past";
}

export function BookingsList() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const [tab, setTab] = useState<Tab>("upcoming");
  const bookings = useBookings();
  const cancelBooking = useCancelBooking();

  const hotelIds = useMemo(() => {
    const ids = new Set<string>();
    (bookings.data ?? []).forEach((b) => {
      if (b.hotelId) ids.add(b.hotelId);
    });
    return Array.from(ids).sort();
  }, [bookings.data]);

  const hotels = useQuery({
    queryKey: [...hotelsKeys.all, "byIds", hotelIds],
    queryFn: () => getHotelsByIds(hotelIds),
    enabled: hotelIds.length > 0,
    staleTime: 60_000,
  });

  const hotelMap = useMemo(() => {
    const list = hotels.data ?? [];
    const map = new Map<string, (typeof list)[number]>();
    list.forEach((h) => map.set(h.id, h));
    return map;
  }, [hotels.data]);

  const grouped = useMemo(() => {
    const groups: Record<Tab, Booking[]> = { upcoming: [], past: [], cancelled: [] };
    (bookings.data ?? []).forEach((b) => groups[classify(b)].push(b));
    return groups;
  }, [bookings.data]);

  const visible = grouped[tab];

  async function handleCancel(id: string) {
    try {
      await cancelBooking.mutateAsync(id);
      toast.success("Booking cancelled");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not cancel");
    }
  }

  if (bookings.isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (bookings.isError) {
    return (
      <EmptyState
        title="Could not load bookings"
        action={
          <button
            type="button"
            onClick={() => bookings.refetch()}
            className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Retry
          </button>
        }
      />
    );
  }

  if (!bookings.data?.length) {
    return (
      <EmptyState
        icon={<BedDouble className="h-6 w-6 text-sky-600" />}
        title="No bookings yet"
        description="Find a stay, experience or transfer you love and reserve it to see it here."
        action={
          <Link
            href="/booking"
            className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Browse booking
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {bookingsKeys.all && hotels.isPending && (
        <div className="inline-flex w-fit items-center gap-2 text-xs text-text-secondary">
          <Spinner className="h-3.5 w-3.5 text-sky-500" /> Loading booking info…
        </div>
      )}

      <div className="flex items-center gap-2 border-b border-border">
        <TabButton active={tab === "upcoming"} count={grouped.upcoming.length} onClick={() => setTab("upcoming")}>
          Upcoming
        </TabButton>
        <TabButton active={tab === "past"} count={grouped.past.length} onClick={() => setTab("past")}>
          Past
        </TabButton>
        <TabButton active={tab === "cancelled"} count={grouped.cancelled.length} onClick={() => setTab("cancelled")}>
          Cancelled
        </TabButton>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<CalendarRange className="h-6 w-6 text-sky-600" />}
          title={`No ${tab} bookings`}
          description={
            tab === "upcoming"
              ? "When you book a stay, experience or transfer, it shows up here."
              : "Nothing to show in this tab."
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visible.map((booking) => {
            const isHotel = booking.kind !== "experience" && booking.kind !== "transport";
            const hotel = booking.hotelId ? hotelMap.get(booking.hotelId) : undefined;
            const nights = getNights(booking.checkIn, booking.checkOut);
            const highlight = highlightId === booking.id;

            const title = isHotel ? hotel?.name ?? "Hotel" : booking.itemName ?? "Booking";
            const image = isHotel ? hotel?.image : booking.itemImage;
            const category = isHotel
              ? hotel?.propertyType ?? "Stay"
              : booking.kind === "transport"
                ? "Transport"
                : "Experience";
            const href = isHotel && booking.hotelId ? `/booking/${booking.hotelId}` : "/booking";

            return (
              <li
                key={booking.id}
                className={cn(
                  "group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-colors",
                  highlight && "border-secondary ring-2 ring-secondary/30",
                )}
              >
                <div className="flex flex-col sm:flex-row">
                  <Link
                    href={href}
                    className="relative aspect-4/3 w-full bg-surface-muted sm:aspect-auto sm:h-auto sm:w-48"
                  >
                    {image && (
                      <Image src={image} alt={title} fill sizes="200px" className="object-cover" />
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary">
                          {category}
                        </p>
                        <Link
                          href={href}
                          className="mt-0.5 block truncate text-base font-semibold text-text-primary hover:underline"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {title}
                        </Link>
                        {isHotel && (
                          <p className="inline-flex items-center gap-1 text-xs text-text-secondary">
                            <MapPin className="h-3.5 w-3.5 text-secondary" />
                            {hotel?.neighborhood ?? "Location"}
                          </p>
                        )}
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
                      <span className="inline-flex items-center gap-1">
                        <CalendarRange className="h-3.5 w-3.5 text-secondary" />
                        {isHotel ? `${booking.checkIn} → ${booking.checkOut}` : booking.date}
                      </span>
                      {isHotel ? (
                        <>
                          <span>{nights} {nights === 1 ? "night" : "nights"}</span>
                          <span>{booking.guests} guests · {booking.rooms} rooms</span>
                        </>
                      ) : (
                        <span>
                          {booking.quantity} {booking.kind === "transport" ? "units" : "guests"}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                      <div className="inline-flex items-center gap-1 text-xs text-text-secondary">
                        {isHotel && hotel && (
                          <>
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {hotel.rating.toFixed(2)}
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-bold text-text-primary">
                          {formatMoney(booking.totalPrice, booking.currency)}
                        </p>
                        {booking.status === "confirmed" && (
                          <button
                            type="button"
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancelBooking.isPending}
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-[11px] font-medium text-text-secondary hover:bg-error-bg hover:text-error-dark"
                          >
                            <Ban className="h-3 w-3" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    {booking.status === "confirmed" && (
                      <p className="inline-flex items-center gap-1 text-[10px] text-text-muted">
                        <ShieldCheck className="h-3 w-3 text-emerald-500" />
                        Free cancellation within 48 hours
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Booking["status"] }) {
  const styles =
    status === "confirmed"
      ? "bg-emerald-500/15 text-emerald-700"
      : status === "cancelled"
        ? "bg-rose-500/15 text-rose-700"
        : "bg-amber-500/15 text-amber-700";
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize", styles)}>
      {status}
    </span>
  );
}

function TabButton({
  children,
  active,
  count,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative -mb-px inline-flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
        active
          ? "border-secondary text-text-primary"
          : "border-transparent text-text-secondary hover:text-text-primary",
      )}
    >
      {children}
      <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
        {count}
      </span>
    </button>
  );
}
