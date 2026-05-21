"use client";

import Image from "next/image";
import { Search, Bell, Settings, Menu } from "lucide-react";

interface Props {
  onMenuToggle: () => void;
}

export default function DashboardHeader({ onMenuToggle }: Props) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center h-16 px-4 md:px-12 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-text-secondary hover:text-navy-950 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span
          className="text-xl font-bold tracking-tight text-navy-950"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Voyager
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 bg-surface-muted px-4 py-1.5 rounded-xl border border-border-strong/30">
          <Search className="h-5 w-5 text-text-secondary shrink-0" />
          <input
            type="text"
            placeholder="Search trips or analytics..."
            className="bg-transparent border-none outline-none text-sm w-64 text-text-primary placeholder:text-text-muted"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="text-text-secondary hover:text-sky-600 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <button className="text-text-secondary hover:text-sky-600 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <Image
            src="/assets/travel_dashboard__img_01.png"
            alt="Alex"
            width={32}
            height={32}
            className="rounded-full object-cover border border-border-strong"
          />
        </div>
      </div>
    </header>
  );
}
