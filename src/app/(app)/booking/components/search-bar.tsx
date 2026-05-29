import { MapPin, CalendarDays, Users } from "lucide-react";

interface BookingSearchBarProps {
  destination: string;
  dates: string;
  guests: string;
}

export default function BookingSearchBar({
  destination,
  dates,
  guests,
}: BookingSearchBarProps) {
  return (
    <div className="mt-8 bg-white/80 backdrop-blur-xl border border-white/20 shadow-sm rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
      <div className="w-full md:flex-1 flex flex-col md:border-r border-border-strong/30 md:pr-6">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1 px-2">
          Destination
        </label>
        <div className="flex items-center gap-2 px-2">
          <MapPin className="h-5 w-5 text-sky-600 shrink-0" />
          <input
            type="text"
            defaultValue={destination}
            className="bg-transparent border-none outline-none text-sm text-text-primary p-0 w-full"
          />
        </div>
      </div>

      <div className="w-full md:flex-1 flex flex-col md:border-r border-border-strong/30 md:pr-6">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1 px-2">
          Dates
        </label>
        <div className="flex items-center gap-2 px-2 cursor-pointer">
          <CalendarDays className="h-5 w-5 text-sky-600 shrink-0" />
          <span className="text-sm text-text-primary">{dates}</span>
        </div>
      </div>

      <div className="w-full md:flex-1 flex flex-col md:border-r border-border-strong/30 md:pr-6">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1 px-2">
          Guests
        </label>
        <div className="flex items-center gap-2 px-2 cursor-pointer">
          <Users className="h-5 w-5 text-sky-600 shrink-0" />
          <span className="text-sm text-text-primary">{guests}</span>
        </div>
      </div>

      <button className="w-full md:w-auto bg-navy-950 text-white px-8 h-12 rounded-xl text-sm font-semibold hover:bg-sky-600 transition-all active:scale-95 flex items-center justify-center shrink-0">
        Search
      </button>
    </div>
  );
}
