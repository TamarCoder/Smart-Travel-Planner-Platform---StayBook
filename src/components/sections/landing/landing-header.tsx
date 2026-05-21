"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, Settings, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "#destinations" },
  { label: "Pricing", href: "#pricing" },
  { label: "Concierge", href: "#concierge" },
];

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-12 h-16 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div className="flex items-center">
        <Link href="/">
          <span
            className="text-xl font-bold tracking-tight text-[#000]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Voyager
          </span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-10">
        {navLinks.map(({ label, href }, i) => (
          <Link
            key={label}
            href={href}
            className={
              i === 0
                ? "text-sm font-semibold text-sky-600 transition-colors"
                : "text-sm font-medium text-[#45464d] hover:text-sky-600 transition-colors"
            }
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4">
          <Bell className="h-5 w-5 text-[#45464d] cursor-pointer hover:text-sky-600 transition-colors" />
          <Settings className="h-5 w-5 text-[#45464d] cursor-pointer hover:text-sky-600 transition-colors" />
        </div>
        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white/40 shadow-sm cursor-pointer hover:scale-95 transition-transform shrink-0">
          <Image
            src="/images/landing/avatar-user.png"
            alt="User profile"
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        </div>
        <button
          className="md:hidden text-[#45464d]"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-border shadow-md px-4 py-4 flex flex-col gap-4 md:hidden">
          {navLinks.map(({ label, href }, i) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={
                i === 0
                  ? "text-sm font-semibold text-sky-600"
                  : "text-sm font-medium text-[#45464d]"
              }
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
