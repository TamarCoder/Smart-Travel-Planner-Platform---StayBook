"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import {
  Bell,
  CheckCheck,
  CalendarRange,
  BedDouble,
  Users2,
  Sparkles,
  X,
} from "lucide-react";
import {
  useDismissNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadCount,
} from "@/features/notifications";
import { useAuthStore } from "@/stores";
import { cn } from "@/lib/utils";
import type { Notification } from "@/features/notifications";

const ICONS: Record<Notification["type"], typeof Bell> = {
  trip: CalendarRange,
  booking: BedDouble,
  collaboration: Users2,
  system: Sparkles,
};

const ACCENTS: Record<Notification["type"], string> = {
  trip: "bg-sky-500/10 text-sky-700",
  booking: "bg-violet-500/10 text-violet-700",
  collaboration: "bg-amber-500/10 text-amber-700",
  system: "bg-emerald-500/10 text-emerald-700",
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.status === "authenticated");
  const { data, isPending } = useNotifications();
  const unread = useUnreadCount();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const dismiss = useDismissNotification();

  if (!isAuthenticated) return null;
  const items = data ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="z-50 w-[360px] rounded-2xl border border-border bg-surface p-3 shadow-xl outline-none"
      >
        <header className="flex items-center justify-between gap-3 px-2 pb-3">
          <div>
            <p className="text-sm font-semibold text-text-primary">Notifications</p>
            <p className="text-[11px] text-text-secondary">
              {unread === 0 ? "All caught up" : `${unread} unread`}
            </p>
          </div>
          {unread > 0 && (
            <button
              type="button"
              onClick={() => markAll.mutate()}
              disabled={markAll.isPending}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-sky-600 hover:bg-sky-500/10"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </header>

        <div className="max-h-[60vh] overflow-y-auto">
          {isPending ? (
            <div className="flex h-24 items-center justify-center text-xs text-text-secondary">
              Loading…
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
              <Bell className="h-6 w-6 text-text-muted" />
              <p className="text-sm font-medium text-text-primary">You&rsquo;re all caught up</p>
              <p className="text-xs text-text-secondary">
                Trip updates, bookings and collaboration land here.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              {items.map((n) => {
                const Icon = ICONS[n.type] ?? Bell;
                const accent = ACCENTS[n.type] ?? "bg-sky-500/10 text-sky-700";
                const Wrapper = n.link ? Link : ("div" as const);
                const wrapperProps = n.link ? { href: n.link } : {};
                return (
                  <li key={n.id} className="group relative">
                    <Wrapper
                      {...(wrapperProps as { href: string })}
                      onClick={() => {
                        if (!n.readAt) markRead.mutate(n.id);
                        if (n.link) setOpen(false);
                      }}
                      className={cn(
                        "flex items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:bg-surface-muted",
                        !n.readAt && "bg-sky-500/5",
                      )}
                    >
                      <span className={cn("inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", accent)}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-text-primary">{n.title}</p>
                        {n.body && (
                          <p className="line-clamp-2 text-xs text-text-secondary">{n.body}</p>
                        )}
                        <p className="mt-0.5 text-[10px] uppercase tracking-wider text-text-muted">
                          {formatTime(n.createdAt)}
                        </p>
                      </div>
                      {!n.readAt && (
                        <span aria-hidden className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                      )}
                    </Wrapper>
                    <button
                      type="button"
                      aria-label="Dismiss"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dismiss.mutate(n.id);
                      }}
                      className="absolute right-2 top-2 hidden rounded-lg p-1 text-text-muted hover:bg-error-bg hover:text-error-dark group-hover:inline-flex"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function formatTime(iso: string) {
  try {
    const ms = Date.now() - new Date(iso).getTime();
    if (Number.isFinite(ms) && ms >= 0) {
      const minutes = Math.round(ms / 60_000);
      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.round(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.round(hours / 24);
      if (days < 7) return `${days}d ago`;
    }
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
}
