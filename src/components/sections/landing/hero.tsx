"use client";

import Image from "next/image";
import { MapPin, Calendar, Search } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] sm:min-h-[750px] md:min-h-[921px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/landing/hero-beach.png"
          alt="Luxury tropical beach"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-[#f7f9fb]/90" />
      </div>

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 text-center py-20 md:py-0">
        <h1
          className="font-bold text-white mb-5 mx-auto leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.75rem, 6vw, 4rem)",
            lineHeight: "1.15",
            letterSpacing: "-0.02em",
            maxWidth: "52rem",
          }}
        >
          The World&apos;s Most{" "}
          <span className="text-sky-400">Refined</span>{" "}
          Travel Experiences
        </h1>

        <p
          className="text-white/90 mb-8 mx-auto text-sm sm:text-base md:text-lg leading-relaxed"
          style={{ maxWidth: "34rem" }}
        >
          Curated by experts, tailored by AI. Discover the next generation of
          luxury travel planning with Voyager.
        </p>

        {/* Mobile search — stacked inside a rounded card */}
        <div
          className="mx-auto md:hidden bg-white/85 backdrop-blur-xl border border-white/30 rounded-3xl p-3 flex flex-col gap-2 shadow-2xl"
          style={{ maxWidth: "28rem" }}
        >
          <div className="flex items-center gap-3 bg-white/60 rounded-2xl px-4 py-3">
            <MapPin className="h-4 w-4 text-sky-600 shrink-0" />
            <input
              type="text"
              placeholder="Where do you want to explore?"
              className="bg-transparent border-none outline-none w-full text-sm text-[#191c1e] placeholder:text-[#45464d]/60"
            />
          </div>
          <div className="flex items-center gap-3 bg-white/60 rounded-2xl px-4 py-3">
            <Calendar className="h-4 w-4 text-sky-600 shrink-0" />
            <input
              type="text"
              placeholder="When?"
              className="bg-transparent border-none outline-none w-full text-sm text-[#191c1e] placeholder:text-[#45464d]/60"
            />
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#00668a] hover:bg-[#004d6a] text-white rounded-2xl text-sm font-semibold transition-all">
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>

        {/* Desktop search — single row pill */}
        <div
          className="hidden md:flex mx-auto bg-white/80 backdrop-blur-xl border border-white/20 rounded-full p-2 items-center gap-2 shadow-2xl"
          style={{ maxWidth: "48rem" }}
        >
          <div className="flex-1 flex items-center gap-3 px-5 py-2">
            <MapPin className="h-4 w-4 text-sky-600 shrink-0" />
            <input
              type="text"
              placeholder="Where do you want to explore?"
              className="bg-transparent border-none outline-none w-full text-sm text-[#191c1e] placeholder:text-[#45464d]/60"
            />
          </div>
          <div className="h-8 w-px bg-[#c6c6cd]/40" />
          <div className="flex-1 flex items-center gap-3 px-5 py-2">
            <Calendar className="h-4 w-4 text-sky-600 shrink-0" />
            <input
              type="text"
              placeholder="When?"
              className="bg-transparent border-none outline-none w-full text-sm text-[#191c1e] placeholder:text-[#45464d]/60"
            />
          </div>
          <button className="flex items-center gap-2 px-7 py-3 bg-[#00668a] hover:bg-[#004d6a] text-white rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:-translate-y-px whitespace-nowrap">
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
