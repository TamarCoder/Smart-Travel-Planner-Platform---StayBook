import Image from "next/image";
import { Search, Bell, Settings } from "lucide-react";

export default function TripHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center h-16 px-4 md:px-12 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div className="flex items-center gap-6">
        <span
          className="text-xl font-bold tracking-tight text-navy-950"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Voyager
        </span>
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#"
            className="text-base text-text-secondary hover:text-sky-600 transition-colors duration-200"
          >
            Destinations
          </a>
          <a href="#" className="text-base font-bold text-sky-600">
            Explore
          </a>
          <a
            href="#"
            className="text-base text-text-secondary hover:text-sky-600 transition-colors duration-200"
          >
            Community
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search experiences..."
            className="pl-10 pr-4 py-2 w-64 bg-surface-muted rounded-full text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-sky-600/30"
          />
        </div>
        <button className="p-2 text-text-secondary hover:text-sky-600 transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        <button className="p-2 text-text-secondary hover:text-sky-600 transition-colors">
          <Settings className="h-5 w-5" />
        </button>
        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shrink-0">
          <Image
            src="/assets/travel_dashboard__img_01.png"
            alt="User"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
