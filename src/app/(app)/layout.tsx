import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Map, Briefcase, Globe, Bookmark, HelpCircle, LogOut, Plus, Bell, Settings } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true },
  { icon: Map, label: "Planner", href: "/planner", active: false },
  { icon: Briefcase, label: "Trips", href: "/trips", active: false },
  { icon: Globe, label: "Explore", href: "/destinations", active: false },
  { icon: Bookmark, label: "Saved", href: "/saved", active: false },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f9fb] flex">
      <aside className="hidden md:flex flex-col w-[220px] shrink-0 bg-white border-r border-[#e0e3e5] h-screen sticky top-0 z-20">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-[#f2f4f6]">
          <span className="text-lg font-bold text-[#000]" style={{ fontFamily: "var(--font-display)" }}>Voyager</span>
        </div>

        <div className="px-4 py-4">
          <Link
            href="/planner"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#000] hover:bg-[#131b2e] text-white text-sm font-semibold transition-all"
          >
            <Plus className="h-4 w-4" />
            New Trip
          </Link>
        </div>

        <nav className="flex-1 px-3 pb-4 flex flex-col gap-0.5">
          {navItems.map(({ icon: Icon, label, href, active }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-[#f2f4f6] text-[#000]"
                  : "text-[#45464d] hover:bg-[#f7f9fb] hover:text-[#000]"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[#f2f4f6] px-3 py-4 flex flex-col gap-0.5">
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#45464d] hover:bg-[#f7f9fb] transition-all">
            <HelpCircle className="h-4 w-4 shrink-0" />
            Help
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#45464d] hover:bg-[#f7f9fb] transition-all">
            <LogOut className="h-4 w-4 shrink-0" />
            Logout
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-[#e0e3e5] px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="relative max-w-xs w-full hidden md:block">
            <input
              type="text"
              placeholder="Search trips or analytics…"
              className="w-full rounded-xl bg-[#f2f4f6] pl-4 pr-4 py-2 text-sm text-[#191c1e] placeholder:text-[#76777d] outline-none focus:ring-2 focus:ring-[#00668a]/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <Bell className="h-5 w-5 text-[#45464d] cursor-pointer hover:text-[#000] transition-colors" />
            <Settings className="h-5 w-5 text-[#45464d] cursor-pointer hover:text-[#000] transition-colors" />
            <div className="h-8 w-8 rounded-full overflow-hidden border border-[#e0e3e5] cursor-pointer">
              <Image src="/assets/travel_dashboard__img_01.png" alt="User" width={32} height={32} className="object-cover w-full h-full" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
