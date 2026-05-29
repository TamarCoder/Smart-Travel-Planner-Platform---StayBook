"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Plane,
  Compass,
  Bookmark,
  HelpCircle,
  LogOut,
  Plus,
  X,
} from "lucide-react";
import { useLogout } from "@/features/auth";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Planner", href: "/planner", icon: CalendarDays },
  { label: "Trips", href: "/dashboard/trips", icon: Plane },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Saved", href: "/dashboard/saved", icon: Bookmark },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExploreSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();

  async function handleLogout() {
    await logout.mutateAsync();
    router.push("/login");
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`flex flex-col w-64 fixed left-0 top-0 bottom-0 z-40 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:pt-20 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/10 lg:hidden">
          <span
            className="text-xl font-bold tracking-tight text-navy-950"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Voyager
          </span>
          <button onClick={onClose} className="text-text-secondary hover:text-navy-950 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <button className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all active:scale-95 shadow-md">
            <Plus className="h-5 w-5" />
            New Trip
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-4">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                className={
                  active
                    ? "flex items-center gap-4 px-6 py-4 rounded-xl bg-sky-600/10 text-sky-600 border-r-2 border-sky-600 text-sm font-medium"
                    : "flex items-center gap-4 px-6 py-4 rounded-xl text-text-secondary hover:bg-sky-600/5 transition-all duration-200 hover:translate-x-1 text-sm font-medium"
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pt-4 border-t border-border-strong/20 flex flex-col gap-1 pb-6">
          <Link
            href="#"
            className="flex items-center gap-4 px-6 py-4 rounded-xl text-text-secondary hover:bg-sky-600/5 transition-all text-sm font-medium"
          >
            <HelpCircle className="h-5 w-5" />
            Help
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-4 rounded-xl text-text-secondary hover:bg-sky-600/5 transition-all text-sm font-medium w-full text-left"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
