"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Activity,
  BedDouble,
  Bookmark,
  CalendarRange,
  Compass,
  Hotel,
  LayoutDashboard,
  LogOut,
  MapPin,
  Sparkles,
  User2,
  Wallet,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHiddenTitle,
} from "@/components/ui/dialog";
import { useUiStore } from "@/stores";
import { useDestinations } from "@/features/destinations";
import { useHotels } from "@/features/hotels";
import { useTrips } from "@/features/trips";
import { useLogout } from "@/features/auth";

interface QuickAction {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  href?: string;
  onSelect?: () => void | Promise<void>;
}

export function CommandPalette() {
  const router = useRouter();
  const open = useUiStore((s) => s.commandPaletteOpen);
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const toggle = useUiStore((s) => s.toggleCommandPalette);

  const logout = useLogout();
  const destinations = useDestinations({ pageSize: 12 });
  const hotels = useHotels({ pageSize: 12 });
  const trips = useTrips();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const meta = isMac ? event.metaKey : event.ctrlKey;
      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  function go(href: string) {
    router.push(href);
    setOpen(false);
  }

  const quickActions: QuickAction[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "explore", label: "Explore destinations", icon: Compass, href: "/explore" },
    { id: "booking", label: "Find a stay", icon: Hotel, href: "/booking" },
    { id: "planner", label: "Trip planner", icon: CalendarRange, href: "/planner" },
    { id: "budget", label: "Budgets", icon: Wallet, href: "/dashboard/budget" },
    { id: "saved", label: "Saved", icon: Bookmark, href: "/dashboard/saved" },
    { id: "bookings", label: "My bookings", icon: BedDouble, href: "/dashboard/bookings" },
    { id: "profile", label: "Profile", icon: User2, href: "/profile" },
    {
      id: "logout",
      label: "Sign out",
      icon: LogOut,
      onSelect: async () => {
        await logout.mutateAsync();
        setOpen(false);
        router.push("/login");
      },
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent size="md" hideClose className="p-0">
        <DialogHiddenTitle>Command palette</DialogHiddenTitle>
        <Command label="Command menu" loop>
          <div className="border-b border-border px-3 py-2">
            <Command.Input
              autoFocus
              placeholder="Search destinations, stays, trips, actions…"
              className="w-full bg-transparent px-2 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none"
            />
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-sm text-text-secondary">
              Nothing matches.
            </Command.Empty>

            <Command.Group heading={<GroupHeading icon={<Sparkles className="h-3.5 w-3.5" />}>Quick actions</GroupHeading>}>
              {quickActions.map((action) => (
                <CommandRow
                  key={action.id}
                  value={`action ${action.label}`}
                  onSelect={() => (action.href ? go(action.href) : action.onSelect?.())}
                  icon={<action.icon className="h-4 w-4 text-sky-600" />}
                  label={action.label}
                />
              ))}
            </Command.Group>

            {(trips.data ?? []).length > 0 && (
              <Command.Group heading={<GroupHeading icon={<CalendarRange className="h-3.5 w-3.5" />}>Your trips</GroupHeading>}>
                {(trips.data ?? []).slice(0, 6).map((trip) => (
                  <CommandRow
                    key={trip.id}
                    value={`trip ${trip.title}`}
                    onSelect={() => go(`/planner/${trip.id}`)}
                    icon={<Activity className="h-4 w-4 text-emerald-600" />}
                    label={trip.title}
                    hint={trip.status}
                  />
                ))}
              </Command.Group>
            )}

            {(destinations.data?.items ?? []).length > 0 && (
              <Command.Group heading={<GroupHeading icon={<Compass className="h-3.5 w-3.5" />}>Destinations</GroupHeading>}>
                {(destinations.data?.items ?? []).map((d) => (
                  <CommandRow
                    key={d.id}
                    value={`destination ${d.name} ${d.country}`}
                    onSelect={() => go(`/explore/${d.slug}`)}
                    icon={<MapPin className="h-4 w-4 text-violet-600" />}
                    label={d.name}
                    hint={d.country}
                  />
                ))}
              </Command.Group>
            )}

            {(hotels.data?.items ?? []).length > 0 && (
              <Command.Group heading={<GroupHeading icon={<Hotel className="h-3.5 w-3.5" />}>Stays</GroupHeading>}>
                {(hotels.data?.items ?? []).map((h) => (
                  <CommandRow
                    key={h.id}
                    value={`hotel ${h.name} ${h.neighborhood}`}
                    onSelect={() => go(`/booking/${h.id}`)}
                    icon={<Hotel className="h-4 w-4 text-amber-600" />}
                    label={h.name}
                    hint={h.neighborhood}
                  />
                ))}
              </Command.Group>
            )}
          </Command.List>
          <footer className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] uppercase tracking-wider text-text-muted">
            <span>↑ ↓ navigate · ⏎ open</span>
            <span>⌘K to close</span>
          </footer>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function GroupHeading({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
      {icon}
      {children}
    </div>
  );
}

interface CommandRowProps {
  value: string;
  icon: React.ReactNode;
  label: string;
  hint?: string;
  onSelect?: () => void;
}

function CommandRow({ value, icon, label, hint, onSelect }: CommandRowProps) {
  return (
    <Command.Item
      value={value}
      onSelect={() => onSelect?.()}
      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-primary outline-none transition-colors data-[selected=true]:bg-surface-muted"
    >
      {icon}
      <span className="flex-1 truncate">{label}</span>
      {hint && <span className="text-[10px] uppercase tracking-wider text-text-muted">{hint}</span>}
    </Command.Item>
  );
}
