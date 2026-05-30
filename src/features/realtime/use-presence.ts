"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { broadcast, subscribe, getTabId } from "@/lib/realtime/channel";
import { useAuthStore } from "@/stores";

const HEARTBEAT_INTERVAL_MS = 5_000;
const STALE_AFTER_MS = 30_000;

export interface PeerPresence {
  id: string;
  userId?: string;
  name: string;
  avatar?: string;
  lastSeen: number;
}

interface PresencePayload {
  userId?: string;
  name: string;
  avatar?: string;
}

function presenceRoom(tripId: string) {
  return `trip:${tripId}:presence`;
}

export function usePresence(tripId: string | undefined) {
  const user = useAuthStore((s) => s.user);
  const [peers, setPeers] = useState<Record<string, PeerPresence>>({});

  const me = useMemo<PresencePayload | null>(() => {
    if (!user) return null;
    return {
      userId: user.id,
      name: user.name,
      avatar: user.avatar,
    };
  }, [user]);

  const emit = useCallback(
    (type: "presence:heartbeat" | "presence:leave") => {
      if (!tripId || !me) return;
      broadcast<PresencePayload>(presenceRoom(tripId), type, me, me.name);
    },
    [tripId, me],
  );

  useEffect(() => {
    if (!tripId || !me) return undefined;

    const unsubscribe = subscribe<PresencePayload>(presenceRoom(tripId), (message) => {
      if (message.type === "presence:leave") {
        setPeers((prev) => {
          if (!prev[message.sender]) return prev;
          const rest = { ...prev };
          delete rest[message.sender];
          return rest;
        });
        return;
      }
      if (message.type === "presence:heartbeat") {
        setPeers((prev) => ({
          ...prev,
          [message.sender]: {
            id: message.sender,
            userId: message.payload.userId,
            name: message.payload.name,
            avatar: message.payload.avatar,
            lastSeen: message.ts,
          },
        }));
      }
    });

    emit("presence:heartbeat");
    const heartbeat = window.setInterval(() => emit("presence:heartbeat"), HEARTBEAT_INTERVAL_MS);
    const prune = window.setInterval(() => {
      setPeers((prev) => {
        const cutoff = Date.now() - STALE_AFTER_MS;
        const filtered = Object.values(prev).filter((p) => p.lastSeen >= cutoff);
        if (filtered.length === Object.keys(prev).length) return prev;
        return Object.fromEntries(filtered.map((p) => [p.id, p]));
      });
    }, HEARTBEAT_INTERVAL_MS);

    const handleLeave = () => emit("presence:leave");
    window.addEventListener("beforeunload", handleLeave);

    return () => {
      window.clearInterval(heartbeat);
      window.clearInterval(prune);
      window.removeEventListener("beforeunload", handleLeave);
      handleLeave();
      unsubscribe();
    };
  }, [tripId, me, emit]);

  const list = useMemo(() => {
    return Object.values(peers).sort((a, b) => a.name.localeCompare(b.name));
  }, [peers]);

  return {
    peers: list,
    selfTabId: getTabId(),
  };
}
