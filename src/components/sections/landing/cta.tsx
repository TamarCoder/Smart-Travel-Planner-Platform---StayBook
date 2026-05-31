"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores";

export function CTASection() {
  const isAuthenticated = useAuthStore((s) => s.status === "authenticated");

  return (
    <section className="py-16 md:py-24 px-4 md:px-12 text-center bg-background">
      <div className="mx-auto py-4 md:py-8" style={{ maxWidth: "42rem" }}>
        <h2
          className="font-bold text-text-primary mb-4 md:mb-5"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.75rem, 5vw, 3rem)",
            lineHeight: "1.15",
            letterSpacing: "-0.02em",
          }}
        >
          Ready to begin your journey?
        </h2>
        <p className="text-sm md:text-lg text-text-secondary mb-8 md:mb-10 leading-relaxed">
          Join an exclusive community of travelers and start planning your next
          escape today.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link
            href={isAuthenticated ? "/dashboard" : "/register"}
            className="w-full sm:w-auto px-8 py-4 bg-navy-950 hover:bg-navy-800 text-white rounded-full text-sm font-semibold transition-all hover:scale-105 text-center"
          >
            {isAuthenticated ? "Open dashboard" : "Create your first plan"}
          </Link>
          <Link
            href={isAuthenticated ? "/planner" : "/login"}
            className="w-full sm:w-auto px-8 py-4 border-2 border-text-primary text-text-primary hover:bg-text-primary hover:text-background rounded-full text-sm font-semibold transition-all text-center"
          >
            {isAuthenticated ? "Continue planning" : "Sign in"}
          </Link>
        </div>
      </div>
    </section>
  );
}
