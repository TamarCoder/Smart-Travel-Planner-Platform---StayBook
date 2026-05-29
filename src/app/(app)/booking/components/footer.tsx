const footerLinks = ["Destinations", "Pricing", "Privacy Policy", "Terms of Service"];

export default function BookingFooter() {
  return (
    <footer className="lg:ml-64 px-4 md:px-12 py-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-border-strong/30">
      <div className="flex flex-col items-center md:items-start gap-1">
        <span
          className="text-xl font-bold tracking-tight text-navy-950"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Voyager
        </span>
        <p className="text-sm text-text-secondary">
          © 2024 Voyager Luxury Travel. All rights reserved.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {footerLinks.map((link) => (
          <a
            key={link}
            href="#"
            className="text-sm text-text-secondary hover:text-sky-600 transition-colors"
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}
