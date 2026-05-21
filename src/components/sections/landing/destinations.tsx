import Image from "next/image";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const destinations = [
  {
    slug: "santorini",
    name: "Santorini Essence",
    location: "Greece",
    price: "from $1,200/night",
    image: "/images/landing/dest-santorini.png",
  },
  {
    slug: "maldives",
    name: "Azure Maldives",
    location: "Maldives",
    price: "from $2,450/night",
    image: "/images/landing/dest-maldives.png",
  },
  {
    slug: "kyoto",
    name: "Kyoto Serenity",
    location: "Japan",
    price: "from $890/night",
    image: "/images/landing/dest-kyoto.png",
  },
];

export function DestinationsSection() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-12 bg-[#f7f9fb]">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-14 gap-4">
          <div>
            <h2
              className="font-bold text-[#000] mb-2 md:mb-3"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.375rem, 3vw, 2rem)",
                lineHeight: "1.25",
              }}
            >
              Curated Destinations
            </h2>
            <p
              className="text-sm md:text-base text-[#45464d] leading-relaxed"
              style={{ maxWidth: "34rem" }}
            >
              Our team of curators hand-selects every property and experience to
              ensure your journey is nothing short of extraordinary.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-[#76777d] flex items-center justify-center hover:bg-sky-600/5 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-[#45464d]" />
            </button>
            <button
              className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-[#76777d] flex items-center justify-center hover:bg-sky-600/5 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-[#45464d]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
          {destinations.map(({ slug, name, location, price, image }) => (
            <div key={slug} className="group cursor-pointer">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 md:mb-6 relative">
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/80 backdrop-blur-xl border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold text-[#191c1e] shadow-sm">
                  {price}
                </div>
              </div>
              <h3
                className="font-semibold text-[#000] mb-1"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 2vw, 1.125rem)" }}
              >
                {name}
              </h3>
              <p className="text-sm text-[#45464d] flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                {location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
