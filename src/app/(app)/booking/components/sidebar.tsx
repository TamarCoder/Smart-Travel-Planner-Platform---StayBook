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

export default function BookingSidebar({ isOpen, onClose }: Props) {
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
        className={`flex flex-col w-64 fixed left-0 top-0 bottom-0 z-40 bg-surface-elevated backdrop-blur-xl border-r border-border shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:pt-16 ${
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
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <CreateTripDialog
            trigger={
              <button className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-md">
                <Plus className="h-5 w-5" />
                New Trip
              </button>
            }
          />
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto">
          {PRIMARY_NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                className={
                  active
                    ? "flex items-center gap-4 px-4 py-2.5 rounded-lg bg-sky-600/10 text-sky-600 border-r-2 border-sky-600 text-sm font-semibold"
                    : "flex items-center gap-4 px-4 py-2.5 rounded-lg text-text-secondary hover:bg-surface-hover transition-all duration-200 text-sm font-medium"
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
                    ? "flex items-center gap-4 px-4 py-2.5 rounded-lg bg-sky-600/10 text-sky-600 border-r-2 border-sky-600 text-sm font-semibold"
                    : "flex items-center gap-4 px-4 py-2.5 rounded-lg text-text-secondary hover:bg-surface-hover transition-all duration-200 text-sm font-medium"
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
            onClick={onClose}
            className="flex items-center gap-4 px-4 py-2.5 rounded-lg text-text-secondary hover:bg-surface-hover transition-all text-sm font-medium"
          >
            <HelpCircle className="h-5 w-5" />
            Help
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-2.5 rounded-lg text-text-secondary hover:bg-surface-hover transition-all text-sm font-medium w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
