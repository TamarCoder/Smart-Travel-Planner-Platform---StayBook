"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useNotifications } from "./hooks";

export type NotificationPermissionState = "default" | "granted" | "denied" | "unsupported";

export function useBrowserNotify(enabled: boolean) {
  const seenRef = useRef<Set<string>>(new Set());
  const initialisedRef = useRef(false);
  const [permission, setPermission] = useState<NotificationPermissionState>(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
    return Notification.permission;
  });

  const { data } = useNotifications();

  const request = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return "unsupported" as const;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  useEffect(() => {
    if (!data) return;
    if (!initialisedRef.current) {
      data.forEach((n) => seenRef.current.add(n.id));
      initialisedRef.current = true;
      return;
    }
    if (!enabled || permission !== "granted") {
      data.forEach((n) => seenRef.current.add(n.id));
      return;
    }
    data.forEach((notification) => {
      if (seenRef.current.has(notification.id)) return;
      seenRef.current.add(notification.id);
      if (notification.readAt) return;
      try {
        const browser = new Notification(notification.title, {
          body: notification.body,
          icon: "/icons/icon.svg",
          badge: "/icons/icon.svg",
          tag: notification.id,
        });
        if (notification.link) {
          browser.onclick = () => {
            window.focus();
            window.location.href = notification.link as string;
            browser.close();
          };
        }
      } catch {
        // Silently skip when constructor is unavailable.
      }
    });
  }, [data, enabled, permission]);

  return { permission, request };
}
