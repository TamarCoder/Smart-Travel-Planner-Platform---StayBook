const stats = [
  { value: "50k+", label: "Destinations" },
  { value: "10k+", label: "Happy Travelers" },
  { value: "120+", label: "Countries" },
  { value: "24/7", label: "Expert Support" },
];

export function StatsSection() {
  return (
    <section className="py-16 px-4 md:px-12 bg-white border-b border-[#e0e3e5]">
      <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center">
            <div
              className="font-bold text-[#000] mb-1 tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: "1.1",
              }}
            >
              {value}
            </div>
            <div className="text-xs font-semibold text-[#45464d] uppercase tracking-widest">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
