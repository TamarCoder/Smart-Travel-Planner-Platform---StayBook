import { LandingHeader } from "@/components/sections/landing/landing-header";
import { HeroSection } from "@/components/sections/landing/hero";
import { StatsSection } from "@/components/sections/landing/stats";
import { DestinationsSection } from "@/components/sections/landing/destinations";
import { TestimonialsSection } from "@/components/sections/landing/testimonials";
import { CTASection } from "@/components/sections/landing/cta";
import { LandingFooter } from "@/components/sections/landing/landing-footer";
import { GlobeSection } from "@/components/sections/landing/globe";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      <main className="pt-16">
        <HeroSection />
        <StatsSection />
        <div id="destinations"><DestinationsSection /></div>
        <GlobeSection />
        <div id="testimonials"><TestimonialsSection /></div>
        <div id="pricing"><CTASection /></div>
      </main>

      <LandingFooter />
    </div>
  );
}
