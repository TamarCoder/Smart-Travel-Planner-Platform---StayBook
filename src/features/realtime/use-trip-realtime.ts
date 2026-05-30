"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { tripsKeys } from "@/features/trips";
import { useChannelListener } from "./use-channel";
import { tripRoom } from "./rooms";

interface RemoteEvent {
  type: string;
  byName?: string;
}

export function useTripRealtime(tripId: string | undefined) {
  const queryClient = useQueryClient();
  const [lastRemote, setLastRemote] = useState<RemoteEvent | null>(null);

  useChannelListener<RemoteEvent>(tripId ? tripRoom(tripId) : undefined, (message) => {
    if (!tripId) return;
    queryClient.invalidateQueries({ queryKey: tripsKeys.detail(tripId) });
    setLastRemote({ type: message.type, byName: message.senderName });
  });

  useEffect(() => {
    if (!lastRemote) return;
    const id = setTimeout(() => setLastRemote(null), 4000);
    return () => clearTimeout(id);
  }, [lastRemote]);

  return { lastRemote };
}