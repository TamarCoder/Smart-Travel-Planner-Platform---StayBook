"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api/auth";
import { useAuthStore } from "@/stores";
import { authKeys } from "./keys";

export function AuthBootstrap() {
  const ran = useRef(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const { token } = useAuthStore.getState();
    if (!token) {
      useAuthStore.getState().setStatus("unauthenticated");
      return;
    }

    getCurrentUser(token)
      .then((user) => {
        useAuthStore.getState().setSession(user, token);
        queryClient.setQueryData(authKeys.me(), user);
      })
      .catch(() => {
        useAuthStore.getState().clearSession();
      });
  }, [queryClient]);

  return null;
}
