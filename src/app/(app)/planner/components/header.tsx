"use client";

import Image from "next/image";
import Link from "next/link";
import { Settings, Share2, Menu } from "lucide-react";
import { getTripById } from "@/lib/api/trips";
import { NotificationBell } from "@/components/shared/notification-bell";

interface Props {
  onMenuToggle: () => void;
}

export default function PlannerHeader({ onMenuToggle }: Props) {
  const trip = getTripById("trip-001");

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
        <div className="hidden md:block h-6 w-px bg-border-strong/40 mx-1" />
        <span className="hidden md:block text-sm text-text-secondary font-medium">
          {trip?.title}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center -space-x-2 mr-2">
          <Image
            src="/assets/travel_dashboard__img_01.png"
            alt="Alex"
            width={32}
            height={32}
            className="rounded-full border-2 border-white object-cover"
          />
          <Image
            src="/assets/travel_dashboard__img_02.png"
            alt="Sarah"
            width={32}
            height={32}
            className="rounded-full border-2 border-white object-cover"
          />
          <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-bold border-2 border-white">
            +2
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <Link
            href="/profile"
            className="text-text-secondary hover:text-sky-600 transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
          <button className="bg-navy-950 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </header>
  );
}
