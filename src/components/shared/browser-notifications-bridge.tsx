"use client";

import { useAuthStore } from "@/stores";
import { useBrowserNotify } from "@/features/notifications";

export function BrowserNotificationsBridge() {
  const enabled = useAuthStore((s) => s.user?.preferences?.notifications ?? false);
  useBrowserNotify(enabled);
  return null;
}
