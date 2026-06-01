"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HelpCircle, LogOut, Plus, X } from "lucide-react";
import { useLogout } from "@/features/auth";
import { PRIMARY_NAV, SECONDARY_NAV } from "@/constants/nav";
import { CreateTripDialog } from "../../dashboard/components/create-trip-dialog";

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
        className={`flex flex-col w-64 fixed left-0 top-0 bottom-0 z-40 bg-surface-elevated backdrop-blur-xl border-r border-border shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:pt-20 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-border lg:hidden">
          <span
            className="text-xl font-bold tracking-tight text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Voyager
          </span>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <CreateTripDialog
            trigger={
              <button className="w-full bg-secondary hover:bg-on-secondary-container text-white py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all active:scale-95 shadow-md">
                <Plus className="h-5 w-5" />
                New Trip
              </button>
            }
          />
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-4 overflow-y-auto">
          {PRIMARY_NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                className={
                  active
                    ? "flex items-center gap-4 px-6 py-3 rounded-xl bg-sky-600/10 text-sky-600 border-r-2 border-sky-600 text-sm font-semibold"
                    : "flex items-center gap-4 px-6 py-3 rounded-xl text-text-secondary hover:bg-sky-600/5 transition-all duration-200 hover:translate-x-1 text-sm font-medium"
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}

          <div className="my-3 border-t border-border" />

          {SECONDARY_NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                className={
                  active
                    ? "flex items-center gap-4 px-6 py-3 rounded-xl bg-sky-600/10 text-sky-600 border-r-2 border-sky-600 text-sm font-semibold"
                    : "flex items-center gap-4 px-6 py-3 rounded-xl text-text-secondary hover:bg-sky-600/5 transition-all duration-200 hover:translate-x-1 text-sm font-medium"
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pt-4 border-t border-border flex flex-col gap-1 pb-6">
          <Link
            href="#"
            className="flex items-center gap-4 px-6 py-3 rounded-xl text-text-secondary hover:bg-sky-600/5 transition-all text-sm font-medium"
          >
            <HelpCircle className="h-5 w-5" />
            Help
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-3 rounded-xl text-text-secondary hover:bg-sky-600/5 transition-all text-sm font-medium w-full text-left"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
