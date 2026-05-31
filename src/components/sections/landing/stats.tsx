const stats = [
  { value: "50k+", label: "Destinations" },
  { value: "10k+", label: "Happy Travelers" },
  { value: "120+", label: "Countries" },
  { value: "24/7", label: "Expert Support" },
];

export function StatsSection() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-12 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center">
            <div
              className="font-bold text-text-primary mb-1 tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 5vw, 3rem)",
                lineHeight: "1.1",
              }}
            >
              {value}
            </div>
            <div className="text-[10px] sm:text-xs font-semibold text-text-secondary uppercase tracking-widest leading-relaxed">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
