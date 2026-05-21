const stats = [
  { value: "50k+", label: "Destinations" },
  { value: "10k+", label: "Happy Travelers" },
  { value: "120+", label: "Countries" },
  { value: "24/7", label: "Expert Support" },
];

export function StatsSection() {
  return (
    <section className="py-16 px-6 md:px-12 bg-white border-b border-border">
      <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="text-5xl md:text-6xl font-bold text-navy-950 mb-2 tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}>
              {value}
            </div>
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-widest">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
