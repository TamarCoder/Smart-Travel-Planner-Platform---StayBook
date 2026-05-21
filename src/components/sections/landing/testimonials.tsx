import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote:
      "Voyager redefined how I think about travel. The level of detail in the planning and the exclusivity of the experiences are truly unmatched in the industry.",
    name: "Marcus Sterling",
    title: "Global Venture Partner",
    avatar: "/images/landing/testimonial-marcus.png",
  },
  {
    id: 2,
    quote:
      "The AI concierge is hauntingly accurate. It suggested a hidden bistro in Lyon that was the highlight of my entire month-long European trip.",
    name: "Elena Rodriguez",
    title: "Interior Designer",
    avatar: "/images/landing/testimonial-elena.png",
  },
  {
    id: 3,
    quote:
      "Finally, a travel app that understands the value of time. The seamless booking and itinerary management allow me to truly disconnect and enjoy the moment.",
    name: "David Chen",
    title: "Tech Executive",
    avatar: "/images/landing/testimonial-david.png",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-6 md:px-12 bg-surface-muted">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold text-navy-950 mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Testimonials
          </h2>
          <p className="text-text-secondary">
            Experiences shared by our community of global explorers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(({ id, quote, name, title, avatar }) => (
            <div
              key={id}
              className="bg-white border border-border rounded-2xl p-8 shadow-md flex flex-col"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-sky-500 text-sky-500" />
                ))}
              </div>

              <p className="text-sm text-navy-950 italic leading-relaxed flex-1 mb-8">
                &ldquo;{quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 mt-auto pt-6 border-t border-border">
                <div className="h-11 w-11 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={avatar}
                    alt={name}
                    width={44}
                    height={44}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-950">{name}</p>
                  <p className="text-xs text-text-muted mt-0.5">{title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
