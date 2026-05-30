"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  dismissNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type Notification,
} from "@/lib/api/notifications";
import { useAuthStore } from "@/stores";
import { notificationsKeys } from "./keys";

export function useNotifications() {
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: notificationsKeys.list(userId),
    queryFn: () => listNotifications(token ?? ""),
    enabled: !!token,
    staleTime: 30_000,
  });
}

export function useUnreadCount() {
  const { data } = useNotifications();
  return (data ?? []).filter((n) => !n.readAt).length;
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation<Notification, Error, string>({
    mutationFn: (id) => markNotificationRead(token ?? "", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.list(userId) });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation<number, Error>({
    mutationFn: () => markAllNotificationsRead(token ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.list(userId) });
    },
  });
}

export function useDismissNotification() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation<void, Error, string>({
    mutationFn: (id) => dismissNotification(token ?? "", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.list(userId) });
    },
  });
}
