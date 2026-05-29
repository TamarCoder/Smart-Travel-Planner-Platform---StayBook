"use client";

import Image from "next/image";
import { Search, Bell, Settings, Menu } from "lucide-react";

interface Props {
  onMenuToggle: () => void;
}

export default function BookingHeader({ onMenuToggle }: Props) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center h-16 px-4 md:px-12 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div className="flex items-center gap-4 md:gap-6">
        <button
          className="lg:hidden text-text-secondary hover:text-navy-950 transition-colors"
          onClick={onMenuToggle}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <span
          className="text-xl font-bold tracking-tight text-navy-950"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Voyager
        </span>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-base font-bold text-sky-600">
            Explore
          </a>
          <a
            href="#"
            className="text-base text-text-secondary hover:text-sky-600 transition-colors duration-200"
          >
            Planner
          </a>
          <a
            href="#"
            className="text-base text-text-secondary hover:text-sky-600 transition-colors duration-200"
          >
            Trips
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-surface-muted px-4 py-2 rounded-full">
          <Search className="h-4 w-4 text-text-secondary shrink-0" />
          <input
            type="text"
            placeholder="Search destinations..."
            className="bg-transparent border-none outline-none text-sm w-48 text-text-primary placeholder:text-text-muted"
          />
        </div>
        <button className="text-text-secondary hover:text-sky-600 transition-colors active:scale-95">
          <Bell className="h-5 w-5" />
        </button>
        <button className="text-text-secondary hover:text-sky-600 transition-colors active:scale-95">
          <Settings className="h-5 w-5" />
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-border-strong shrink-0">
          <Image
            src="/assets/travel_dashboard__img_01.png"
            alt="User"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
