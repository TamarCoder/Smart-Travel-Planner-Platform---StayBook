import { LandingHeader } from "@/components/sections/landing/landing-header";
import { HeroSection } from "@/components/sections/landing/hero";
import { StatsSection } from "@/components/sections/landing/stats";
import { DestinationsSection } from "@/components/sections/landing/destinations";
import { TestimonialsSection } from "@/components/sections/landing/testimonials";
import { CTASection } from "@/components/sections/landing/cta";
import { LandingFooter } from "@/components/sections/landing/landing-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed z-[-1] w-[500px] h-[500px] rounded-full bg-sky-500 opacity-[0.08] blur-[80px] top-[-200px] left-[-100px] pointer-events-none" />
      <div className="fixed z-[-1] w-[400px] h-[400px] rounded-full bg-emerald-500 opacity-[0.08] blur-[80px] bottom-[-100px] right-[-50px] pointer-events-none" />

      <LandingHeader />

      <main className="pt-16">
        <HeroSection />
        <StatsSection />
        <div id="destinations"><DestinationsSection /></div>
        <div id="testimonials"><TestimonialsSection /></div>
        <div id="pricing"><CTASection /></div>
      </main>

      <LandingFooter />
    </div>
  );
}
