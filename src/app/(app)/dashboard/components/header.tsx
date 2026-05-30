"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Settings, Menu } from "lucide-react";
import { NotificationBell } from "@/components/shared/notification-bell";

interface Props {
  onMenuToggle: () => void;
}

export default function DashboardHeader({ onMenuToggle }: Props) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center h-16 px-4 md:px-12 bg-surface-elevated backdrop-blur-xl border-b border-border shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-text-secondary hover:text-text-primary transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span
          className="text-xl font-bold tracking-tight text-text-primary"
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

        <div className="flex items-center gap-3">
          <NotificationBell />
          <Link
            href="/profile"
            className="text-text-secondary hover:text-sky-600 transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
          <Link href="/profile" aria-label="Profile">
            <Image
              src="/assets/travel_dashboard__img_01.png"
              alt="Alex"
              width={32}
              height={32}
              className="rounded-full object-cover border border-border-strong"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
