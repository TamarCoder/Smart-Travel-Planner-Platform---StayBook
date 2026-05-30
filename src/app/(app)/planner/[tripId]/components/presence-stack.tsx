"use client";

import { Users2 } from "lucide-react";
import { usePresence } from "@/features/realtime";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PresenceStackProps {
  tripId: string;
  className?: string;
}

export function PresenceStack({ tripId, className }: PresenceStackProps) {
  const { peers } = usePresence(tripId);

  if (peers.length === 0) {
    return (
      <div className={cn("inline-flex items-center gap-2 text-xs text-text-secondary", className)}>
        <Users2 className="h-3.5 w-3.5" />
        <span>You are the only one here</span>
      </div>
    );
  }

  const visible = peers.slice(0, 4);
  const overflow = peers.length - visible.length;

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div className="flex -space-x-2">
        {visible.map((peer) => (
          <div
            key={peer.id}
            title={peer.name}
            className="relative rounded-full ring-2 ring-surface"
          >
            <Avatar src={peer.avatar} fallback={peer.name} size="sm" />
            <span className="absolute -bottom-0.5 -right-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-surface" />
          </div>
        ))}
        {overflow > 0 && (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted text-[10px] font-semibold text-text-secondary ring-2 ring-surface">
            +{overflow}
          </span>
        )}
      </div>
      <span className="text-xs text-text-secondary">
        {peers.length} {peers.length === 1 ? "collaborator" : "collaborators"} online
      </span>
    </div>
  );
}
