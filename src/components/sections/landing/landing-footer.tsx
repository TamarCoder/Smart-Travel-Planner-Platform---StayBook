const footerLinks = [
  { label: "DESTINATIONS", href: "#" },
  { label: "PRICING", href: "#" },
  { label: "PRIVACY POLICY", href: "#" },
  { label: "TERMS OF SERVICE", href: "#" },
];

export function LandingFooter() {
  return (
    <footer className="w-full py-8 md:py-10 px-4 md:px-12 bg-background border-t border-border-strong">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span
            className="text-lg font-bold text-navy-950"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Voyager
          </span>
          <p className="text-sm text-text-secondary/70">Luxury Travel Reimagined.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {footerLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-xs font-semibold text-text-secondary hover:text-sky-600 transition-colors tracking-wider"
            >
              {label}
            </a>
          ))}
        </div>

        <p className="text-xs text-text-secondary text-center md:text-right">
          © 2024 Voyager Luxury Travel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
