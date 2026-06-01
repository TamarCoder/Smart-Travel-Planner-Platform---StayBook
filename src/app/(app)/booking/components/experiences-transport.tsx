"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Clock, Car, Plane, TrainFront, Ship, Bus, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import attractionsData from "@/data/attractions.json";
import transportData from "@/data/transport.json";
import type { Attraction } from "@/lib/api/destinations";
import { useCreateItemBooking } from "@/features/bookings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type BookingKind = "experience" | "transport";

interface TransportOption {
  id: string;
  name: string;
  category: string;
  provider: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  unit: string;
  duration: string;
  description: string;
}

interface BookableItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  price: number;
  currency: string;
  unit: string;
  duration: string;
  description: string;
  subtitle: string;
  image?: string;
}

const TRANSPORT_ICON: Record<string, typeof Car> = {
  transfer: Car,
  car: Car,
  rail: TrainFront,
  flight: Plane,
  ferry: Ship,
  shuttle: Bus,
};

const ATTRACTIONS = attractionsData as Attraction[];
const TRANSPORT = transportData as TransportOption[];

function experienceItems(): BookableItem[] {
  return ATTRACTIONS.map((a) => ({
    id: a.id,
    name: a.name,
    category: a.category,
    rating: a.rating,
    price: a.priceFrom,
    currency: a.currency ?? "USD",
    unit: "per person",
    duration: a.duration,
    description: a.description,
    subtitle: a.category,
    image: a.image,
  }));
}

function transportItems(): BookableItem[] {
  return TRANSPORT.map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category,
    rating: t.rating,
    price: t.price,
    currency: t.currency,
    unit: t.unit,
    duration: t.duration,
    description: t.description,
    subtitle: t.provider,
  }));
}

function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

export function ExperiencesTransport({ kind }: { kind: BookingKind }) {
  const items = kind === "experience" ? experienceItems() : transportItems();
  const [selected, setSelected] = useState<BookableItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = TRANSPORT_ICON[item.category] ?? Car;
          return (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {item.image ? (
                <div className="relative h-44 w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-44 w-full items-center justify-center bg-surface-muted">
                  <Icon className="h-12 w-12 text-primary-container" />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className="font-semibold text-text-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.name}
                  </h3>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-text-primary">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {item.rating.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs capitalize text-text-secondary">{item.subtitle}</p>
                <p className="line-clamp-2 text-sm text-text-secondary">{item.description}</p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                    <Clock className="h-3.5 w-3.5" /> {item.duration}
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-bold text-text-primary">
                      {formatPrice(item.price, item.currency)}
                    </p>
                    <p className="text-[10px] text-text-muted">{item.unit}</p>
                  </div>
                </div>
                <Button size="sm" className="mt-2 w-full" onClick={() => setSelected(item)}>
                  Book
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <ItemBookingDialog kind={kind} item={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function ItemBookingDialog({
  kind,
  item,
  onClose,
}: {
  kind: BookingKind;
  item: BookableItem | null;
  onClose: () => void;
}) {
  const create = useCreateItemBooking();
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState(1);

  const total = item ? item.price * quantity : 0;
  const canConfirm = !!item && !!date && quantity >= 1 && !create.isPending;

  async function confirm() {
    if (!item || !date) return;
    try {
      await create.mutateAsync({
        kind,
        itemId: item.id,
        itemName: item.name,
        itemImage: item.image,
        date,
        quantity,
        price: item.price,
        currency: item.currency,
      });
      toast.success(`${item.name} booked`);
      setDate("");
      setQuantity(1);
      onClose();
    } catch {
      toast.error("Could not complete booking. Try again.");
    }
  }

  return (
    <Dialog open={item !== null} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-display)" }}>{item?.name}</DialogTitle>
          <DialogDescription>
            {kind === "experience" ? "Reserve your spot" : "Confirm your transport"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-text-primary">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl bg-surface-muted px-4 py-2.5 text-sm text-text-primary outline-none transition focus:ring-2 focus:ring-secondary"
            />
          </label>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              {kind === "experience" ? "Guests" : "Quantity"}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:bg-surface-muted"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-sm font-semibold text-text-primary">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:bg-surface-muted"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm text-text-secondary">Total</span>
            <span className="text-lg font-bold text-text-primary">
              {item ? formatPrice(total, item.currency) : ""}
            </span>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </DialogClose>
          <Button size="sm" loading={create.isPending} disabled={!canConfirm} onClick={confirm}>
            Confirm booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
