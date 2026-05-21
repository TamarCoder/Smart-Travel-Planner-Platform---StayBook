import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 px-6 text-center bg-background">
      <div className="mx-auto" style={{ maxWidth: "40rem" }}>
        <h2
          className="text-4xl md:text-5xl font-bold text-navy-950 mb-5 tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ready to begin your journey?
        </h2>
        <p className="text-lg text-text-secondary mb-10 leading-relaxed">
          Join an exclusive community of travelers and start planning your next
          escape today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="rounded-full px-10">
            Create Your First Plan
          </Button>
          <Button variant="secondary" size="lg" className="rounded-full px-10">
            Talk to a Concierge
          </Button>
        </div>
      </div>
    </section>
  );
}
