import Image from "next/image";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <section className="py-20 px-6 md:px-12 bg-background">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
          <div style={{ maxWidth: "36rem" }}>
            <h2
              className="text-3xl md:text-4xl font-bold text-navy-950 mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Curated Destinations
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Our team of curators hand-selects every property and experience to
              ensure your journey is nothing short of extraordinary.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button variant="secondary" size="icon" className="rounded-full h-12 w-12" aria-label="Previous">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="secondary" size="icon" className="rounded-full h-12 w-12" aria-label="Next">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinations.map(({ slug, name, location, price, image }) => (
            <div key={slug} className="group cursor-pointer">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-5 relative">
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md border border-white/30 px-3 py-1.5 rounded-full text-xs font-semibold text-navy-950 shadow-sm">
                  {price}
                </div>
              </div>
              <h3
                className="text-xl font-semibold text-navy-950 mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {name}
              </h3>
              <p className="text-sm text-text-secondary flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                {location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
