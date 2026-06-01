"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores";
import { useTrips } from "@/features/trips";
import { createNotification } from "@/lib/api/notifications";
import { notificationsKeys } from "@/features/notifications/keys";

const REMINDER_WINDOW_DAYS = 7;
const STORAGE_KEY = "voyager:trip-reminders-sent";

function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000);
}

function loadSent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveSent(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    return;
  }
}

export function TripRemindersBridge() {
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);
  const trips = useTrips();
  const queryClient = useQueryClient();
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current || !token || !trips.data) return;
    ranRef.current = true;

    const sent = new Set(loadSent());
    const due = trips.data.filter((trip) => {
      const days = daysUntil(trip.startDate);
      return days >= 0 && days <= REMINDER_WINDOW_DAYS && !sent.has(trip.id);
    });
    if (due.length === 0) return;

    (async () => {
      for (const trip of due) {
        const days = daysUntil(trip.startDate);
        const when = days === 0 ? "today" : days === 1 ? "tomorrow" : `in ${days} days`;
        const created = await createNotification(token, {
          type: "trip",
          title: `${trip.title} starts ${when}`,
          body: "Review your itinerary and packing list before you head out.",
          link: `/planner/${trip.id}`,
        }).catch(() => null);
        if (created) sent.add(trip.id);
      }
      saveSent([...sent]);
      queryClient.invalidateQueries({ queryKey: notificationsKeys.list(userId) });
    })();
  }, [token, userId, trips.data, queryClient]);

  return null;
}
