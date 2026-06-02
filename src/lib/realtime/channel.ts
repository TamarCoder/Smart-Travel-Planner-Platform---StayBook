import { nanoid } from "nanoid";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getRealtimeClient } from "./supabase";

export interface RealtimeMessage<T = unknown> {
  id: string;
  type: string;
  payload: T;
  sender: string;
  senderName?: string;
  ts: number;
}

export type RealtimeListener<T = unknown> = (message: RealtimeMessage<T>) => void;

const TAB_ID =
  typeof window === "undefined"
    ? "server"
    : (() => {
        const KEY = "staybook.tabId";
        const stored = window.sessionStorage.getItem(KEY);
        if (stored) return stored;
        const fresh = nanoid(10);
        window.sessionStorage.setItem(KEY, fresh);
        return fresh;
      })();

export function getTabId() {
  return TAB_ID;
}

const BROADCAST_EVENT = "msg";

interface Room {
  listeners: Set<RealtimeListener>;
  local: BroadcastChannel | null;
  localHandler: ((event: MessageEvent<RealtimeMessage>) => void) | null;
  remote: RealtimeChannel | null;
  remoteReady: boolean;
  outbox: RealtimeMessage[];
}

const rooms = new Map<string, Room>();
const seen = new Set<string>();
const seenOrder: string[] = [];
const SEEN_LIMIT = 1000;

function remember(id: string) {
  if (seen.has(id)) return false;
  seen.add(id);
  seenOrder.push(id);
  if (seenOrder.length > SEEN_LIMIT) {
    const evicted = seenOrder.shift();
    if (evicted) seen.delete(evicted);
  }
  return true;
}

function deliver(room: Room, message: RealtimeMessage) {
  if (message.sender === TAB_ID) return;
  if (!remember(message.id)) return;
  for (const listener of room.listeners) listener(message);
}

function ensureRoom(name: string): Room {
  const existing = rooms.get(name);
  if (existing) return existing;

  const room: Room = {
    listeners: new Set(),
    local: null,
    localHandler: null,
    remote: null,
    remoteReady: false,
    outbox: [],
  };
  rooms.set(name, room);

  if (typeof window !== "undefined" && typeof BroadcastChannel !== "undefined") {
    room.local = new BroadcastChannel(`staybook:${name}`);
    room.localHandler = (event) => {
      if (event.data) deliver(room, event.data);
    };
    room.local.addEventListener("message", room.localHandler);
  }

  const client = getRealtimeClient();
  if (client) {
    room.remote = client.channel(`staybook:${name}`, {
      config: { broadcast: { self: false, ack: false } },
    });
    room.remote.on("broadcast", { event: BROADCAST_EVENT }, ({ payload }) => {
      deliver(room, payload as RealtimeMessage);
    });
    room.remote.subscribe((status) => {
      if (status !== "SUBSCRIBED") return;
      room.remoteReady = true;
      const pending = room.outbox.splice(0);
      for (const message of pending) sendRemote(room, message);
    });
  }

  return room;
}

function sendRemote(room: Room, message: RealtimeMessage) {
  if (!room.remote) return;
  if (!room.remoteReady) {
    room.outbox.push(message);
    return;
  }
  void room.remote.send({ type: "broadcast", event: BROADCAST_EVENT, payload: message });
}

function teardown(name: string, room: Room) {
  if (room.local && room.localHandler) {
    room.local.removeEventListener("message", room.localHandler);
    room.local.close();
  }
  if (room.remote) {
    const client = getRealtimeClient();
    client?.removeChannel(room.remote);
  }
  rooms.delete(name);
}

export function broadcast<T>(
  room: string,
  type: string,
  payload: T,
  senderName?: string,
): RealtimeMessage<T> | null {
  if (typeof window === "undefined") return null;
  const target = ensureRoom(room);
  const message: RealtimeMessage<T> = {
    id: nanoid(12),
    type,
    payload,
    sender: TAB_ID,
    senderName,
    ts: Date.now(),
  };
  target.local?.postMessage(message);
  sendRemote(target, message as RealtimeMessage);
  return message;
}

export function subscribe<T = unknown>(
  room: string,
  listener: RealtimeListener<T>,
): () => void {
  if (typeof window === "undefined") return () => {};
  const target = ensureRoom(room);
  target.listeners.add(listener as RealtimeListener);
  return () => {
    target.listeners.delete(listener as RealtimeListener);
    if (target.listeners.size === 0) teardown(room, target);
  };
}
