import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-12 text-center bg-[#f7f9fb]">
      <div className="mx-auto py-4 md:py-8" style={{ maxWidth: "42rem" }}>
        <h2
          className="font-bold text-[#000] mb-4 md:mb-5"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.75rem, 5vw, 3rem)",
            lineHeight: "1.15",
            letterSpacing: "-0.02em",
          }}
        >
          Ready to begin your journey?
        </h2>
        <p className="text-sm md:text-lg text-[#45464d] mb-8 md:mb-10 leading-relaxed">
          Join an exclusive community of travelers and start planning your next
          escape today.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 bg-[#000] hover:bg-[#131b2e] text-white rounded-full text-sm font-semibold transition-all hover:scale-105 text-center"
          >
            Create Your First Plan
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 border-2 border-[#000] text-[#000] hover:bg-[#000] hover:text-white rounded-full text-sm font-semibold transition-all text-center"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
