import { nanoid } from "nanoid";

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

const channels = new Map<string, BroadcastChannel>();

function open(name: string): BroadcastChannel | null {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
    return null;
  }
  const existing = channels.get(name);
  if (existing) return existing;
  const channel = new BroadcastChannel(`staybook:${name}`);
  channels.set(name, channel);
  return channel;
}

export function broadcast<T>(
  room: string,
  type: string,
  payload: T,
  senderName?: string,
): RealtimeMessage<T> | null {
  const channel = open(room);
  const message: RealtimeMessage<T> = {
    id: nanoid(12),
    type,
    payload,
    sender: TAB_ID,
    senderName,
    ts: Date.now(),
  };
  channel?.postMessage(message);
  return message;
}

export function subscribe<T = unknown>(
  room: string,
  listener: RealtimeListener<T>,
): () => void {
  const channel = open(room);
  if (!channel) return () => {};
  const handler = (event: MessageEvent<RealtimeMessage<T>>) => {
    if (!event.data) return;
    if (event.data.sender === TAB_ID) return;
    listener(event.data);
  };
  channel.addEventListener("message", handler);
  return () => {
    channel.removeEventListener("message", handler);
  };
}