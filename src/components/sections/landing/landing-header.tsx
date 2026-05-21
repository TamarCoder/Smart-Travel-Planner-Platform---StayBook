"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Bell, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Destinations" },
  { href: "/pricing", label: "Pricing" },
  { href: "/concierge", label: "Concierge" },
];

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-16 flex items-center justify-between px-6 md:px-12 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <Link href="/" className="font-bold text-2xl tracking-tight text-navy-950">
        Voyager
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map(({ href, label }, i) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "text-sm font-medium transition-colors duration-200",
              i === 0
                ? "text-sky-500 font-semibold"
                : "text-text-secondary hover:text-sky-500"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3">
          <button className="text-text-secondary hover:text-sky-500 transition-colors" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
          <button className="text-text-secondary hover:text-sky-500 transition-colors" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white/40 shadow-sm hover:scale-95 transition-transform cursor-pointer shrink-0">
          <Image
            src="/images/landing/avatar-user.png"
            alt="User profile"
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-t border-border px-6 py-4 flex flex-col gap-1 md:hidden shadow-md">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-sky-500 hover:bg-surface-muted rounded-xl transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
