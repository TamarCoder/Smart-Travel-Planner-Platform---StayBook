"use client";

import Image from "next/image";
import { MapPin, Calendar, Search } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[700px] md:min-h-[921px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/landing/hero-beach.png"
          alt="Luxury tropical beach"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#f7f9fb]/90" />
      </div>

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 md:px-12 text-center">
        <h1
          className="font-bold text-white mb-6 mx-auto"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            lineHeight: "1.15",
            letterSpacing: "-0.02em",
            maxWidth: "56rem",
          }}
        >
          The World&apos;s Most{" "}
          <span className="text-sky-400">Refined</span> Travel Experiences
        </h1>

        <p
          className="text-white/90 mb-10 mx-auto text-base md:text-lg leading-relaxed"
          style={{ maxWidth: "36rem" }}
        >
          Curated by experts, tailored by AI. Discover the next generation of
          luxury travel planning with Voyager.
        </p>

        <div
          className="mx-auto bg-white/80 backdrop-blur-xl border border-white/20 rounded-full p-3 flex flex-col md:flex-row items-stretch md:items-center gap-3 shadow-2xl"
          style={{ maxWidth: "48rem" }}
        >
          <div className="flex-1 flex items-center gap-3 px-4">
            <MapPin className="h-4 w-4 text-sky-600 shrink-0" />
            <input
              type="text"
              placeholder="Where do you want to explore?"
              className="bg-transparent border-none outline-none w-full text-sm text-[#191c1e] placeholder:text-[#45464d]/60"
            />
          </div>
          <div className="hidden md:block h-10 w-px bg-[#c6c6cd]/40" />
          <div className="flex-1 flex items-center gap-3 px-4">
            <Calendar className="h-4 w-4 text-sky-600 shrink-0" />
            <input
              type="text"
              placeholder="When?"
              className="bg-transparent border-none outline-none w-full text-sm text-[#191c1e] placeholder:text-[#45464d]/60"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-8 py-3 bg-[#00668a] hover:bg-[#004d6a] text-white rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:-translate-y-px">
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
