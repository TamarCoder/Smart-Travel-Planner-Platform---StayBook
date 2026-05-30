"use client";

import { useIsMutating, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { tripsKeys } from "@/features/trips";
import { useChannelListener } from "./use-channel";
import { tripRoom } from "./rooms";

interface RemoteEvent {
  type: string;
  byName?: string;
}

const EVENT_LABEL: Record<string, string> = {
  "activity:added": "added an activity",
  "activity:updated": "edited an activity",
  "activity:deleted": "removed an activity",
  "activity:moved": "moved an activity",
  "activity:reordered": "reordered the schedule",
  "collaborator:added": "added a teammate",
  "collaborator:removed": "removed a teammate",
};

export function useTripRealtime(tripId: string | undefined) {
  const queryClient = useQueryClient();
  const mutationCount = useIsMutating({ mutationKey: tripsKeys.all });
  const mutationCountRef = useRef(mutationCount);
  const [lastRemote, setLastRemote] = useState<RemoteEvent | null>(null);

  useEffect(() => {
    mutationCountRef.current = mutationCount;
  }, [mutationCount]);

  useChannelListener<RemoteEvent>(tripId ? tripRoom(tripId) : undefined, (message) => {
    if (!tripId) return;
    queryClient.invalidateQueries({ queryKey: tripsKeys.detail(tripId) });

    const label = EVENT_LABEL[message.type];
    if (!label) return;

    const who = message.senderName ?? "Someone";
    const inFlight = mutationCountRef.current > 0;
    const description = inFlight
      ? "Your local changes were merged with the latest version."
      : undefined;
    toast.message(`${who} ${label}`, { description });
    setLastRemote({ type: message.type, byName: who });
  });

  useEffect(() => {
    if (!lastRemote) return;
    const id = setTimeout(() => setLastRemote(null), 4000);
    return () => clearTimeout(id);
  }, [lastRemote]);

  return { lastRemote };
}
