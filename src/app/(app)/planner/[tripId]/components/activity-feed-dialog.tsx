"use client";

import { useState } from "react";
import { Activity, ArrowRightLeft, MessageCircle, Pencil, Plus, Trash2, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { TripActivityLog } from "@/lib/api/db";

const ICONS: Record<string, typeof Plus> = {
  add: Plus,
  edit: Pencil,
  delete: Trash2,
  move: ArrowRightLeft,
  invite: UserPlus,
  comment: MessageCircle,
  create: Activity,
  complete: Activity,
};

const ACCENT: Record<string, string> = {
  add: "bg-emerald-500/10 text-emerald-700",
  edit: "bg-sky-500/10 text-sky-700",
  delete: "bg-rose-500/10 text-rose-700",
  move: "bg-violet-500/10 text-violet-700",
  invite: "bg-amber-500/10 text-amber-700",
  comment: "bg-sky-500/10 text-sky-700",
  create: "bg-emerald-500/10 text-emerald-700",
  complete: "bg-emerald-500/10 text-emerald-700",
};

interface ActivityFeedDialogProps {
  log: TripActivityLog[];
}

export function ActivityFeedDialog({ log }: ActivityFeedDialogProps) {
  const [open, setOpen] = useState(false);
  const recent = log.slice(0, 30);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-text-primary transition-colors hover:bg-surface-hover"
        >
          <Activity className="h-3.5 w-3.5 text-sky-600" />
          Activity
          {recent.length > 0 && (
            <span className="rounded-full bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700">
              {recent.length}
            </span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-display)" }}>Recent activity</DialogTitle>
          <DialogDescription>Everything your collaborators have done on this trip.</DialogDescription>
        </DialogHeader>
        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-surface-muted/40 p-6 text-center text-xs text-text-secondary">
            Nothing has happened yet. Make an edit to see it appear here live.
          </p>
        ) : (
          <ol className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-1">
            {recent.map((item) => {
              const Icon = ICONS[item.type] ?? Activity;
              const accent = ACCENT[item.type] ?? "bg-sky-500/10 text-sky-700";
              return (
                <li key={item.id} className="flex gap-3 rounded-2xl border border-border bg-surface p-3 text-sm">
                  <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-xl", accent)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-text-primary">{item.title}</p>
                    {item.subtitle && (
                      <p className="truncate text-xs text-text-secondary">{item.subtitle}</p>
                    )}
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-text-muted">
                      {formatTime(item.time)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </DialogContent>
    </Dialog>
  );
}

function formatTime(iso: string) {
  try {
    const ms = Date.now() - new Date(iso).getTime();
    if (Number.isFinite(ms)) {
      const minutes = Math.max(0, Math.round(ms / 60_000));
      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.round(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.round(hours / 24);
      if (days < 7) return `${days}d ago`;
    }
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
}
