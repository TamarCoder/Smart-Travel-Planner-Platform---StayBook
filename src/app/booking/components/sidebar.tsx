import Link from "next/link";
import {
  Plus,
  LayoutDashboard,
  CalendarDays,
  Compass,
  Plane,
  Bookmark,
  HelpCircle,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Planner", href: "/planner", icon: CalendarDays },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Trips", href: "#", icon: Plane },
  { label: "Saved", href: "#", icon: Bookmark },
];

export default function BookingSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-0 bottom-0 z-40 pt-16 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-lg">
      <div className="px-6 py-6">
        <button className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-md">
          <Plus className="h-5 w-5" />
          New Trip
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = label === "Explore";
          return (
            <Link
              key={label}
              href={href}
              className={
                active
                  ? "flex items-center gap-4 px-4 py-3 rounded-lg bg-sky-600/10 text-sky-600 border-r-2 border-sky-600 text-sm font-bold"
                  : "flex items-center gap-4 px-4 py-3 rounded-lg text-text-secondary hover:bg-surface-hover transition-all duration-200 text-sm font-medium"
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6 flex flex-col gap-1">
        <Link
          href="#"
          className="flex items-center gap-4 px-4 py-3 rounded-lg text-text-secondary hover:bg-surface-hover transition-all text-sm font-medium"
        >
          <HelpCircle className="h-5 w-5" />
          Help
        </Link>
        <Link
          href="#"
          className="flex items-center gap-4 px-4 py-3 rounded-lg text-text-secondary hover:bg-surface-hover transition-all text-sm font-medium"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
