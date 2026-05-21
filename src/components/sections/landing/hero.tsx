"use client";

import Image from "next/image";
import { useState } from "react";
import { MapPin, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  return (
    <section className="relative min-h-[900px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/landing/hero-beach.png"
          alt="Luxury tropical beach"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-[#f7f9fb]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center py-32">
        <h1
          className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The World&apos;s Most{" "}
          <span className="text-sky-400">Refined</span>{" "}
          Travel Experiences
        </h1>

        <p className="text-lg md:text-xl text-white/85 mb-12 mx-auto leading-relaxed" style={{ maxWidth: "42rem" }}>
          Curated by experts, tailored by AI. Discover the next generation of
          luxury travel planning with Voyager.
        </p>

        <div
          className="mx-auto bg-white/80 backdrop-blur-md border border-white/30 rounded-full p-3 flex flex-col md:flex-row items-center gap-3 shadow-2xl"
          style={{ maxWidth: "48rem" }}
        >
          <div className="flex-1 flex items-center gap-3 px-5 w-full min-w-0">
            <MapPin className="h-5 w-5 text-sky-500 shrink-0" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where do you want to explore?"
              className="bg-transparent border-none outline-none w-full text-sm text-navy-950 placeholder:text-text-secondary font-medium"
            />
          </div>

          <div className="hidden md:block h-8 w-px bg-border shrink-0" />

          <div className="flex-1 flex items-center gap-3 px-5 w-full min-w-0">
            <Calendar className="h-5 w-5 text-sky-500 shrink-0" />
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="When?"
              className="bg-transparent border-none outline-none w-full text-sm text-navy-950 placeholder:text-text-secondary font-medium"
            />
          </div>

          <Button size="lg" className="w-full md:w-auto rounded-full px-8 shrink-0 gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </section>
  );
}
