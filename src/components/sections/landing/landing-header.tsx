"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

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

      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="hidden md:block text-sm font-medium text-[#45464d] hover:text-[#000] transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="hidden md:block text-sm font-semibold px-5 py-2 bg-[#000] hover:bg-[#131b2e] text-white rounded-full transition-all"
        >
          Get started
        </Link>
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
          <div className="pt-2 border-t border-[#e0e3e5] flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-[#45464d] py-1">
              Sign in
            </Link>
            <Link href="/register" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-center py-2.5 bg-[#000] text-white rounded-full">
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
