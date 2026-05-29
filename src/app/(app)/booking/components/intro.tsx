interface BookingIntroProps {
  heading: string;
  location: string;
  resultCount: number;
}

export default function BookingIntro({
  heading,
  location,
  resultCount,
}: BookingIntroProps) {
  return (
    <section className="pt-10">
      <h1
        className="text-4xl md:text-5xl font-bold text-navy-950 mb-2"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
      >
        {heading}
      </h1>
      <p className="text-lg text-text-secondary">
        {resultCount} luxury destinations available in {location}
      </p>
    </section>
  );
}
