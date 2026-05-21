import Link from "next/link";

const footerLinks = [
  { href: "/explore", label: "Destinations" },
  { href: "/pricing", label: "Pricing" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export function LandingFooter() {
  return (
    <footer className="w-full py-10 px-6 md:px-12 bg-white border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex flex-col gap-1.5">
        <span className="text-xl font-bold text-navy-950 tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}>
          Voyager
        </span>
        <p className="text-sm text-text-secondary">Luxury Travel Reimagined.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {footerLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-xs font-semibold text-text-secondary hover:text-sky-500 transition-colors uppercase tracking-wide"
          >
            {label}
          </Link>
        ))}
      </div>

      <p className="text-xs text-text-secondary text-right">
        © 2024 Voyager Luxury Travel. All rights reserved.
      </p>
    </footer>
  );
}
