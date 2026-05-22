import Image from "next/image";
import { Landmark, Drama, Sun, Cloud, Utensils, Hotel, Car, Star } from "lucide-react";

const infoCards = [
  {
    icon: Landmark,
    label: "History",
    text: "Forged by one of the largest volcanic eruptions in recorded history, the crescent caldera of Santorini has drawn settlers and traders since the Bronze Age.",
  },
  {
    icon: Drama,
    label: "Culture",
    text: "Island life moves to the rhythm of the sea — whitewashed cliff villages, blue-domed chapels, and a proud tradition of volcanic-soil winemaking.",
  },
];

const forecast = [
  { day: "Mon", icon: Sun, temp: "25°" },
  { day: "Tue", icon: Cloud, temp: "22°" },
  { day: "Wed", icon: Sun, temp: "24°" },
];

const budget = [
  { icon: Utensils, label: "Dining", amount: "€85" },
  { icon: Hotel, label: "Stay", amount: "€240" },
  { icon: Car, label: "Transport", amount: "€45" },
];

const landmarks = [
  {
    image: "/assets/destination_santorini_greece__img_06.png",
    title: "Fira Cathedral",
    description: "A landmark Orthodox cathedral crowning the cliffs of the island capital.",
    rating: "4.9",
  },
  {
    image: "/assets/destination_santorini_greece__img_07.png",
    title: "Caldera Gardens",
    description: "Sculpture-lined terraces with sweeping views over the volcanic bay.",
    rating: "4.8",
  },
];

export default function TripDetails() {
  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <h2
          className="text-2xl md:text-3xl font-semibold text-navy-950"
          style={{ fontFamily: "var(--font-display)" }}
        >
          A Legacy of Beauty and Culture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {infoCards.map(({ icon: Icon, label, text }) => (
            <div
              key={label}
              className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center gap-3 text-sky-600">
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-widest">{label}</span>
              </div>
              <p className="text-text-secondary leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg rounded-xl p-6 flex flex-col justify-between gap-6">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-medium uppercase tracking-widest text-text-secondary">
                Weather
              </h3>
              <Sun className="h-5 w-5 text-sky-600" />
            </div>
            <div className="text-center">
              <span
                className="text-4xl md:text-5xl font-bold text-navy-950"
                style={{ fontFamily: "var(--font-display)" }}
              >
                24°C
              </span>
              <p className="text-text-secondary mt-1">Sunny &amp; Clear</p>
            </div>
          </div>
          <div className="flex justify-between border-t border-border pt-4">
            {forecast.map(({ day, icon: Icon, temp }) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-secondary">{day}</p>
                <Icon className="h-4 w-4 text-sky-600" />
                <p className="text-sm font-bold text-navy-950">{temp}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg rounded-xl p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center gap-3">
            <h3 className="text-sm font-medium uppercase tracking-widest text-text-secondary">
              Average Daily Budget
            </h3>
            <span className="bg-sky-600/10 text-sky-600 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
              Premium Class
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {budget.map(({ icon: Icon, label, amount }) => (
              <div key={label} className="space-y-2">
                <Icon className="h-5 w-5 text-sky-600" />
                <p className="text-xs text-text-secondary">{label}</p>
                <p
                  className="text-xl md:text-2xl font-bold text-navy-950"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-end gap-4">
          <h2
            className="text-2xl md:text-3xl font-semibold text-navy-950"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Must-Visit Landmarks
          </h2>
          <a href="#" className="text-sm font-medium text-sky-600 hover:underline shrink-0">
            View map
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {landmarks.map(({ image, title, description, rating }) => (
            <div key={title} className="group cursor-pointer">
              <div className="relative h-52 rounded-xl overflow-hidden mb-3">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-xl border border-white/20 shadow-sm px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-sky-600 text-sky-600" />
                  <span className="text-sm font-bold text-navy-950">{rating}</span>
                </div>
              </div>
              <h4
                className="text-lg font-semibold text-navy-950"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {title}
              </h4>
              <p className="text-text-secondary text-sm line-clamp-1">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2
          className="text-2xl md:text-3xl font-semibold text-navy-950"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Traveler Insights
        </h2>
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg rounded-xl p-6">
          <div className="flex gap-4 md:gap-6">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-border-strong shrink-0">
              <Image
                src="/assets/destination_santorini_greece__img_08.png"
                alt="Elena Rodriguez"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex justify-between items-center gap-2">
                <h5 className="font-semibold text-navy-950">Elena Rodriguez</h5>
                <span className="text-xs text-text-secondary shrink-0">2 weeks ago</span>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-sky-600 text-sky-600" />
                ))}
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                The caldera sunset from Oia is unforgettable. Book a catamaran cruise at dusk
                — worth every euro for the views and the island calm.
              </p>
              <div className="flex gap-3 pt-1">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src="/assets/destination_santorini_greece__img_09.png"
                    alt="Review photo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src="/assets/destination_santorini_greece__img_10.png"
                    alt="Review photo"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
