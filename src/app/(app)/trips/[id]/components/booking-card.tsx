import { Star, CalendarDays, Diamond, Sparkles } from "lucide-react";
import Link from "next/link";

export default function BookingCard() {
  return (
    <div className="sticky top-24 bg-white/80 backdrop-blur-xl border-2 border-sky-600/10 shadow-xl rounded-2xl p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-text-secondary mb-1">Starts from</p>
          <p
            className="text-4xl font-bold text-navy-950"
            style={{ fontFamily: "var(--font-display)" }}
          >
            €1,240 <span className="text-lg font-medium text-text-secondary">/pp</span>
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-sky-600 text-sky-600" />
          <span className="font-bold text-navy-950">4.9</span>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wide text-text-secondary">
            Travel Dates
          </label>
          <div className="flex items-center gap-3 bg-surface-muted p-4 rounded-xl cursor-pointer hover:bg-surface-hover transition-colors">
            <CalendarDays className="h-5 w-5 text-sky-600 shrink-0" />
            <span className="text-sm text-text-primary">Oct 12 — Oct 18, 2024</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wide text-text-secondary">
            Experience Tier
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 rounded-xl border-2 border-sky-600 bg-sky-600/5 flex flex-col items-center gap-1.5">
              <Diamond className="h-5 w-5 text-sky-600" />
              <span className="text-xs font-bold text-sky-600">Luxury</span>
            </button>
            <button className="p-4 rounded-xl border-2 border-transparent bg-surface-muted hover:border-border-strong flex flex-col items-center gap-1.5 transition-colors">
              <Sparkles className="h-5 w-5 text-text-secondary" />
              <span className="text-xs font-bold text-text-secondary">Bespoke</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href="/booking"
          className="block w-full text-center bg-secondary hover:bg-on-secondary-container text-white py-4 rounded-xl text-base font-semibold active:scale-95 transition-all"
        >
          Book This Journey
        </Link>
        <button className="w-full bg-transparent border border-border-strong text-navy-950 py-4 rounded-xl text-base font-semibold hover:bg-surface-hover transition-all">
          Add to Planner
        </button>
      </div>

      <p className="text-center text-xs text-text-secondary">
        Price includes private airport transfers &amp; curated meals.
      </p>
    </div>
  );
}
