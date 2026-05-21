const footerLinks = [
  { label: "Destinations", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

export default function DashboardFooter() {
  return (
    <footer className="lg:ml-64 w-full lg:w-[calc(100%-16rem)] py-10 px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 bg-background border-t border-border-strong">
      <div>
        <span
          className="text-base font-bold text-navy-950"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Voyager
        </span>
        <p className="text-xs text-text-secondary mt-1">
          © 2024 Voyager Luxury Travel. All rights reserved.
        </p>
      </div>

      <div className="flex gap-10">
        {footerLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="text-xs text-text-secondary hover:text-sky-600 transition-colors"
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
