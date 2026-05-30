"use client";

import { useEffect, useRef } from "react";
import {
  broadcast,
  subscribe,
  type RealtimeListener,
  type RealtimeMessage,
} from "@/lib/realtime/channel";

export function useChannelListener<T = unknown>(
  room: string | null | undefined,
  listener: RealtimeListener<T>,
) {
  const listenerRef = useRef(listener);

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    if (!room) return;
    return subscribe<T>(room, (message) => {
      listenerRef.current(message);
    });
  }, [room]);
}

export function useChannelEmitter(room: string | null | undefined, senderName?: string) {
  return function emit<T>(type: string, payload: T): RealtimeMessage<T> | null {
    if (!room) return null;
    return broadcast<T>(room, type, payload, senderName);
  };
}