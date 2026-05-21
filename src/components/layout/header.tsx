"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Search, Bell, Menu, X, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/map", label: "Map" },
  { href: "/trips", label: "My Trips" },
  { href: "/hotels", label: "Hotels" },
];

function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface-elevated backdrop-blur-md">
      <div className="mx-auto max-w-[1280px] px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm leading-none">S</span>
          </div>
          <span className="font-bold text-base text-text-primary tracking-tight hidden sm:block">
            StayBook
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5 flex-1 max-w-md">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
                  active
                    ? "text-sky-500 bg-sky-500/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" aria-label="Search (⌘K)">
            <Search className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-sky-500 ring-2 ring-surface" />
          </Button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1">
                <Avatar fallback="TK" size="sm" online={true} />
                <ChevronDown className="h-3.5 w-3.5 text-text-muted hidden sm:block" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="z-50 min-w-[200px] bg-surface border border-border rounded-xl shadow-xl p-1.5 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-2.5 border-b border-border mb-1">
                  <p className="text-sm font-semibold text-text-primary">Tamar K.</p>
                  <p className="text-xs text-text-muted mt-0.5">thamuna@gmail.com</p>
                </div>

                {[
                  { icon: User, label: "Profile", href: "/profile" },
                  { icon: Settings, label: "Settings", href: "/settings" },
                ].map(({ icon: Icon, label, href }) => (
                  <DropdownMenu.Item key={href} asChild>
                    <Link
                      href={href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors cursor-pointer focus:outline-none focus:bg-surface-muted"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  </DropdownMenu.Item>
                ))}

                <DropdownMenu.Separator className="my-1 border-t border-border" />

                <DropdownMenu.Item asChild>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-error hover:bg-error-bg transition-colors cursor-pointer focus:outline-none focus:bg-error-bg">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-3 flex flex-col gap-0.5">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "text-sky-500 bg-sky-500/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

export { Header };
