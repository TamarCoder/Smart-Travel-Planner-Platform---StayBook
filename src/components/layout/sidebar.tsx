"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Plane,
  Compass,
  Map,
  Building2,
  Wallet,
  Settings,
  ChevronLeft,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/trips", icon: Plane, label: "My Trips" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/map", icon: Map, label: "Map" },
  { href: "/hotels", icon: Building2, label: "Hotels" },
  { href: "/budget", icon: Wallet, label: "Budget" },
];

const bottomItems = [
  { href: "/settings", icon: Settings, label: "Settings" },
];

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  collapsed,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  collapsed: boolean;
}) {
  const link = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150",
        "px-3 py-2.5",
        active
          ? "bg-sky-500/10 text-sky-500"
          : "text-text-secondary hover:text-text-primary hover:bg-surface-muted",
        collapsed && "justify-center px-2.5"
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-16 h-[calc(100vh-4rem)] flex flex-col shrink-0",
        "border-r border-border bg-surface",
        "transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[60px]" : "w-64"
      )}
    >
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {navItems.map(({ href, icon, label }) => (
          <NavItem
            key={href}
            href={href}
            icon={icon}
            label={label}
            active={pathname === href || pathname.startsWith(href + "/")}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="p-2 border-t border-border space-y-0.5">
        {bottomItems.map(({ href, icon, label }) => (
          <NavItem
            key={href}
            href={href}
            icon={icon}
            label={label}
            active={pathname === href}
            collapsed={collapsed}
          />
        ))}

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
                "text-sm font-medium text-text-muted",
                "hover:text-text-primary hover:bg-surface-muted",
                "transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500",
                collapsed && "justify-center px-2.5"
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-transform duration-300",
                  collapsed && "rotate-180"
                )}
              />
              {!collapsed && (
                <span className="text-sm">Collapse</span>
              )}
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">Expand</TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  );
}

export { Sidebar };
