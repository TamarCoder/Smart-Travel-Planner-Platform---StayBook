import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote:
      "Voyager redefined how I think about travel. The level of detail in the planning and the exclusivity of the experiences are truly unmatched in the industry.",
    name: "Marcus Sterling",
    title: "Global Venture Partner",
    avatar: "/assets/luxury_travel_planner_landing_page__img_08.png",
  },
  {
    id: 2,
    quote:
      "The AI concierge is hauntingly accurate. It suggested a hidden bistro in Lyon that was the highlight of my entire month-long European trip.",
    name: "Elena Rodriguez",
    title: "Interior Designer",
    avatar: "/assets/luxury_travel_planner_landing_page__img_07.png",
  },
  {
    id: 3,
    quote:
      "Finally, a travel app that understands the value of time. The seamless booking and itinerary management allow me to truly disconnect and enjoy the moment.",
    name: "David Chen",
    title: "Tech Executive",
    avatar: "/assets/luxury_travel_planner_landing_page__img_06.png",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-12 bg-surface-muted">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <h2
            className="font-bold text-navy-950 mb-2 md:mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.375rem, 3vw, 2rem)",
              lineHeight: "1.25",
            }}
          >
            Testimonials
          </h2>
          <p className="text-sm md:text-base text-text-secondary">
            Experiences shared by our community of global explorers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {testimonials.map(({ id, quote, name, title, avatar }) => (
            <div
              key={id}
              className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-10 shadow-sm flex flex-col"
            >
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 md:h-5 md:w-5 fill-sky-400 text-sky-400" />
                ))}
              </div>
              <p className="text-sm md:text-base text-text-primary italic leading-relaxed flex-1 mb-6 md:mb-10">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 md:gap-4 mt-auto">
                <div className="h-11 w-11 md:h-12 md:w-12 rounded-full overflow-hidden border border-border-strong shrink-0">
                  <Image
                    src={avatar}
                    alt={name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-navy-950" style={{ letterSpacing: "0.01em" }}>
                    {name}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">{title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
