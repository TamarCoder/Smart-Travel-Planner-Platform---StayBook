"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAuthStore } from "@/stores";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "#destinations" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
];

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.status === "authenticated");
  const ctaHref = isAuthenticated ? "/dashboard" : "/register";
  const ctaLabel = isAuthenticated ? "Open dashboard" : "Get started";

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-12 h-16 bg-surface-elevated backdrop-blur-xl border-b border-border shadow-sm">
      <div className="flex items-center">
        <Link href="/">
          <span
            className="text-xl font-bold tracking-tight text-text-primary"
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
                : "text-sm font-medium text-text-secondary hover:text-sky-600 transition-colors"
            }
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <ThemeToggle className="hidden md:inline-flex" />
        {!isAuthenticated && (
          <Link
            href="/login"
            className="hidden md:block text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign in
          </Link>
        )}
        <Link
          href={ctaHref}
          className="hidden md:block text-sm font-semibold px-5 py-2 bg-navy-950 hover:bg-navy-800 text-white rounded-full transition-all"
        >
          {ctaLabel}
        </Link>
        <button
          className="md:hidden text-text-secondary"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-16 left-0 w-full bg-surface-elevated backdrop-blur-xl border-b border-border shadow-md px-4 py-4 flex flex-col gap-4 md:hidden">
          {navLinks.map(({ label, href }, i) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={
                i === 0
                  ? "text-sm font-semibold text-sky-600"
                  : "text-sm font-medium text-text-secondary"
              }
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-text-secondary">Theme</span>
              <ThemeToggle align="end" />
            </div>
            {!isAuthenticated && (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-text-secondary py-1"
              >
                Sign in
              </Link>
            )}
            <Link
              href={ctaHref}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-semibold text-center py-2.5 bg-navy-950 text-white rounded-full"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
