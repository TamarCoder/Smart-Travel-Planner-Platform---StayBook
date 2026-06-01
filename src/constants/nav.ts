import {
  LayoutDashboard,
  CalendarDays,
  Compass,
  Hotel,
  BedDouble,
  Wallet,
  Bookmark,
  User2,
  Users2,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Booking", href: "/booking", icon: Hotel },
  { label: "Planner", href: "/planner", icon: CalendarDays },
];

export const SECONDARY_NAV: NavItem[] = [
  { label: "Reservations", href: "/dashboard/bookings", icon: BedDouble },
  { label: "Budget", href: "/dashboard/budget", icon: Wallet },
  { label: "Saved", href: "/dashboard/saved", icon: Bookmark },
  { label: "Feed", href: "/feed", icon: Newspaper },
  { label: "Travelers", href: "/people", icon: Users2 },
  { label: "Profile", href: "/profile", icon: User2 },
];
