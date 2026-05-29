import { Plus, Minus, Layers, Locate } from "lucide-react";
import AttractionCard from "./attraction-card";

const attractions = [
  {
    id: "att-1",
    title: "Lake Zurich Pier",
    description: "Perfect for sunset walks and evening boat rides. Highly rated for views.",
    price: "$25 / person",
    image: "/assets/interactive_world_map__img_04.png",
    saved: true,
    avatarCount: 12,
  },
  {
    id: "att-2",
    title: "Bahnhofstrasse District",
    description: "The ultimate destination for luxury shopping and Swiss precision watches.",
    price: "Free Entry",
    image: "/assets/interactive_world_map__img_05.png",
    hours: "Open 24/7",
  },
  {
    id: "att-3",
    title: "Kunsthaus Museum",
    description: "A world-renowned collection of modern and classic masterpieces.",
    price: "$18 / person",
    image: "/assets/interactive_world_map__img_06.png",
    recommended: true,
  },
];

export default function ExploreMain() {
  return (
    <main className="lg:ml-64 pt-16 h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(148,163,184,0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.25) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundColor: "#e2e8f0",
        }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 1000">
          <path d="M400,300 Q550,450 700,400" fill="none" opacity="0.6" stroke="#0ea5e9" strokeDasharray="8 8" strokeWidth="4" />
          <path d="M700,400 Q800,500 850,700" fill="none" opacity="0.6" stroke="#0ea5e9" strokeDasharray="8 8" strokeWidth="4" />
        </svg>

        <div className="absolute top-[30%] left-[40%] -translate-x-1/2 -translate-y-1/2 cursor-pointer">
          <div className="bg-navy-950 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1 border border-white/40 hover:scale-110 transition-transform text-sm font-semibold">
            $450
          </div>
        </div>

        <div className="absolute top-[40%] left-[70%] -translate-x-1/2 -translate-y-1/2 cursor-pointer">
          <div className="bg-white text-navy-950 px-3 py-1 rounded-full shadow-lg border border-navy-950/20 hover:scale-110 transition-transform text-sm font-semibold">
            Art Center
          </div>
        </div>

        <div className="absolute top-[70%] left-[85%] -translate-x-1/2 -translate-y-1/2 cursor-pointer">
          <div className="bg-sky-100 text-sky-600 px-3 py-1 rounded-full shadow-lg border border-white hover:scale-110 transition-transform text-sm font-semibold">
            $85
          </div>
        </div>
      </div>

      <div className="absolute right-4 md:right-6 top-20 md:top-24 flex flex-col gap-2 z-30">
        <div className="flex flex-col bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-lg">
          <button className="p-2.5 md:p-3 hover:bg-surface-hover transition-colors border-b border-border text-text-secondary">
            <Plus className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <button className="p-2.5 md:p-3 hover:bg-surface-hover transition-colors text-text-secondary">
            <Minus className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>
        <button className="bg-white/80 backdrop-blur-xl border border-white/20 p-2.5 md:p-3 rounded-xl shadow-lg text-text-secondary hover:bg-surface-hover transition-colors">
          <Layers className="h-4 w-4 md:h-5 md:w-5" />
        </button>
        <button className="bg-white/80 backdrop-blur-xl border border-white/20 p-2.5 md:p-3 rounded-xl shadow-lg text-text-secondary hover:bg-surface-hover transition-colors">
          <Locate className="h-4 w-4 md:h-5 md:w-5" />
        </button>
      </div>

      <div className="absolute top-20 md:top-24 left-4 md:left-6 z-30 bg-white/80 backdrop-blur-xl border border-white/20 p-3 md:p-5 rounded-2xl shadow-xl w-44 sm:w-56 md:w-64">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <div>
            <h3
              className="text-base md:text-lg font-semibold text-navy-950"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Zurich
            </h3>
            <p className="text-xs md:text-sm text-text-secondary">Partly Cloudy</p>
          </div>
          <span
            className="text-2xl md:text-4xl font-bold text-sky-600"
            style={{ fontFamily: "var(--font-display)" }}
          >
            22°
          </span>
        </div>
        <div className="hidden sm:flex justify-between items-center bg-white/40 p-2.5 md:p-3 rounded-xl">
          <div className="flex flex-col items-center">
            <span className="text-[10px] md:text-[11px] text-text-muted">Humidity</span>
            <span className="text-xs md:text-sm font-medium text-navy-950">45%</span>
          </div>
          <div className="w-px h-6 md:h-8 bg-border" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] md:text-[11px] text-text-muted">UV Index</span>
            <span className="text-xs md:text-sm font-medium text-navy-950">Medium</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 md:bottom-10 left-4 right-4 md:left-6 md:right-6 z-30 pointer-events-none">
        <div className="flex items-center justify-between mb-3 pointer-events-auto">
          <h2
            className="text-lg md:text-2xl font-semibold text-navy-950 drop-shadow-sm"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Nearby Attractions
          </h2>
          <button className="text-sky-600 text-sm font-medium hover:underline pointer-events-auto">
            View all
          </button>
        </div>
        <div className="flex gap-4 md:gap-5 overflow-x-auto pb-3 md:pb-4 no-scrollbar pointer-events-auto">
          {attractions.map((a) => (
            <AttractionCard key={a.id} {...a} />
          ))}
        </div>
      </div>
    </main>
  );
}
