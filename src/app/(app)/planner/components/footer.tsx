import Link from "next/link";
import { LayoutDashboard, CalendarDays, Plus, Compass, User } from "lucide-react";

export default function PlannerFooter() {
  return (
    <>
      <footer className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl px-4 py-2 flex justify-around items-center border-t border-white/20 z-50">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-text-secondary hover:text-sky-600 transition-colors">
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[10px] font-bold">Dashboard</span>
        </Link>
        <Link href="/planner" className="flex flex-col items-center gap-1 text-sky-600">
          <CalendarDays className="h-5 w-5" />
          <span className="text-[10px] font-bold">Planner</span>
        </Link>
        <div className="relative -top-4">
          <button className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-white shadow-lg ring-4 ring-background cursor-pointer">
            <Plus className="h-6 w-6" />
          </button>
        </div>
        <Link href="/dashboard/explore" className="flex flex-col items-center gap-1 text-text-secondary hover:text-sky-600 transition-colors">
          <Compass className="h-5 w-5" />
          <span className="text-[10px] font-bold">Explore</span>
        </Link>
        <button className="flex flex-col items-center gap-1 text-text-secondary hover:text-sky-600 transition-colors">
          <User className="h-5 w-5" />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </footer>

      <footer className="hidden md:flex lg:ml-64 w-full lg:w-[calc(100%-16rem)] py-10 px-4 md:px-12 justify-between items-center gap-6 bg-background border-t border-border-strong">
        <div>
          <span className="text-base font-bold text-navy-950" style={{ fontFamily: "var(--font-display)" }}>
            Voyager
          </span>
          <p className="text-xs text-text-secondary mt-1">© 2024 Voyager Luxury Travel. All rights reserved.</p>
        </div>
        <div className="flex gap-10">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-navy-950">Explore</span>
            <Link href="#" className="text-xs text-text-secondary hover:text-sky-600 transition-colors">Destinations</Link>
            <Link href="#" className="text-xs text-text-secondary hover:text-sky-600 transition-colors">Pricing</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-navy-950">Legal</span>
            <Link href="#" className="text-xs text-text-secondary hover:text-sky-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-text-secondary hover:text-sky-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
