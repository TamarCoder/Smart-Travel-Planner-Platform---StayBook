"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/stores";
import { useChannelListener } from "@/features/realtime/use-channel";
import { userRoom } from "@/features/realtime/rooms";
import { notificationsKeys } from "@/features/notifications/keys";

interface NewNotificationPayload {
  id: string;
  title: string;
  body?: string;
  link?: string;
}

export function NotificationsRealtimeBridge() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  useChannelListener<NewNotificationPayload>(
    userId ? userRoom(userId) : undefined,
    (message) => {
      if (!userId || message.type !== "notification:new") return;
      queryClient.invalidateQueries({ queryKey: notificationsKeys.list(userId) });
      toast.message(message.payload.title, {
        description: message.payload.body,
      });
    },
  );

  return null;
}
