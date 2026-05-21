import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Clock, Search, SlidersHorizontal } from "lucide-react";
import { getAllDestinations, getCategories } from "@/lib/api/destinations";

export default function DestinationsPage() {
  const destinations = getAllDestinations();
  const categories = ["All", ...getCategories()];

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <header className="bg-white border-b border-[#e0e3e5] sticky top-0 z-30">
        <div className="max-w-[1280px] mx-auto px-4 md:px-12 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold text-[#000]" style={{ fontFamily: "var(--font-display)" }}>
            Voyager
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/destinations" className="text-sm font-semibold text-[#00668a]">Destinations</Link>
            <Link href="#" className="text-sm text-[#45464d] hover:text-[#000] transition-colors">Pricing</Link>
            <Link href="#" className="text-sm text-[#45464d] hover:text-[#000] transition-colors">Concierge</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-[#45464d] hover:text-[#000] transition-colors hidden sm:block">Sign in</Link>
            <Link href="/register" className="text-sm font-semibold px-4 py-2 bg-[#000] hover:bg-[#131b2e] text-white rounded-full transition-all">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-white border-b border-[#e0e3e5] py-10 md:py-16">
        <div className="max-w-[1280px] mx-auto px-4 md:px-12">
          <h1
            className="font-bold text-[#191c1e] mb-3"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}
          >
            Curated Destinations
          </h1>
          <p className="text-[#45464d] text-sm md:text-base mb-8 max-w-xl">
            Every destination is hand-selected by our luxury travel editors and verified by our global concierge network.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#76777d] pointer-events-none" />
              <input
                type="text"
                placeholder="Search destinations…"
                className="w-full rounded-xl bg-[#f2f4f6] border border-transparent pl-10 pr-4 py-3 text-sm text-[#191c1e] placeholder:text-[#76777d] outline-none focus:border-[#00668a] focus:bg-white focus:ring-2 focus:ring-[#00668a]/20 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#e0e3e5] bg-white text-sm font-medium text-[#45464d] hover:border-[#c6c6cd] transition-all shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-8">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                cat === "All"
                  ? "bg-[#000] text-white"
                  : "bg-white border border-[#e0e3e5] text-[#45464d] hover:border-[#c6c6cd]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <main className="max-w-[1280px] mx-auto px-4 md:px-12 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-[#e0e3e5] hover:border-[#c6c6cd] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-[#191c1e]">
                  from ${dest.pricePerNight.toLocaleString()}/night
                </div>
                {dest.featured && (
                  <div className="absolute top-3 left-3 bg-[#00668a] px-3 py-1 rounded-full text-xs font-semibold text-white">
                    Featured
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3
                    className="text-base font-bold text-[#191c1e] leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {dest.name}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="h-3.5 w-3.5 fill-[#40c2fd] text-[#40c2fd]" />
                    <span className="text-xs font-semibold text-[#191c1e]">{dest.rating}</span>
                    <span className="text-xs text-[#76777d]">({dest.reviewCount})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  <MapPin className="h-3.5 w-3.5 text-[#76777d]" />
                  <span className="text-xs text-[#76777d]">{dest.country}</span>
                </div>

                <p className="text-xs text-[#45464d] leading-relaxed mb-4 line-clamp-2">
                  {dest.tagline}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[#f2f4f6]">
                  <div className="flex items-center gap-1.5 text-xs text-[#45464d]">
                    <Clock className="h-3.5 w-3.5 text-[#76777d]" />
                    {dest.bestSeason}
                  </div>
                  <span className="text-xs font-semibold text-[#00668a] group-hover:underline">
                    View details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
