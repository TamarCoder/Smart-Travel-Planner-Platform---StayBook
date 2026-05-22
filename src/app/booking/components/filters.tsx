import { Star } from "lucide-react";

interface BookingFiltersProps {
  priceMin: string;
  priceMax: string;
  rating: number;
  amenities: { label: string; checked: boolean }[];
  neighborhoods: { label: string; selected: boolean }[];
}

export default function BookingFilters({
  priceMin,
  priceMax,
  rating,
  amenities,
  neighborhoods,
}: BookingFiltersProps) {
  return (
    <section className="mt-8 bg-white/80 backdrop-blur-xl border border-white/20 shadow-sm rounded-2xl p-6">
      <h3
        className="text-xl font-semibold text-navy-950 mb-6"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Filters
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h4 className="text-sm font-medium text-navy-950 mb-4">
            Price Range (per night)
          </h4>
          <div className="h-1 bg-surface-hover rounded-full relative mb-4 mt-3">
            <div className="absolute left-1/4 right-1/4 h-full bg-sky-600 rounded-full" />
            <div className="absolute left-1/4 -top-2 w-5 h-5 bg-white border-2 border-sky-600 rounded-full shadow-sm cursor-pointer" />
            <div className="absolute right-1/4 -top-2 w-5 h-5 bg-white border-2 border-sky-600 rounded-full shadow-sm cursor-pointer" />
          </div>
          <div className="flex justify-between text-xs text-text-secondary">
            <span>{priceMin}</span>
            <span>{priceMax}</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-navy-950 mb-4">Property Rating</h4>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((n) => {
              const active = n === rating;
              return (
                <button
                  key={n}
                  className={
                    active
                      ? "py-2 rounded-lg border-2 border-sky-600 text-sky-600 font-bold text-xs flex flex-col items-center gap-1"
                      : "py-2 rounded-lg border border-border-strong hover:border-sky-600 transition-colors text-xs font-medium text-text-secondary flex flex-col items-center gap-1"
                  }
                >
                  {n}
                  <Star className="h-3.5 w-3.5 fill-sky-600 text-sky-600" />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-navy-950 mb-4">Amenities</h4>
          <div className="flex flex-col gap-3">
            {amenities.map(({ label, checked }) => (
              <label key={label} className="flex items-center gap-3 group cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={checked}
                  className="w-5 h-5 rounded border-border-strong accent-sky-600 cursor-pointer"
                />
                <span className="text-sm text-text-secondary group-hover:text-navy-950 transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-navy-950 mb-4">Neighborhood</h4>
          <div className="flex flex-col gap-3">
            {neighborhoods.map(({ label, selected }) => (
              <label key={label} className="flex items-center gap-3 group cursor-pointer">
                <input
                  type="radio"
                  name="neighborhood"
                  defaultChecked={selected}
                  className="w-5 h-5 border-border-strong accent-sky-600 cursor-pointer"
                />
                <span className="text-sm text-text-secondary group-hover:text-navy-950 transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
