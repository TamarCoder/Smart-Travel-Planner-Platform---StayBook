"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listFavorites,
  toggleFavorite,
  type FavoriteEntityType,
  type ToggleFavoriteInput,
  type ToggleFavoriteResult,
} from "@/lib/api/favorites";
import type { DbFavorite } from "@/lib/api/db";
import { useAuthStore } from "@/stores";
import { favoritesKeys } from "./keys";

export function useFavorites() {
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: favoritesKeys.list(userId),
    queryFn: () => listFavorites(token ?? ""),
    enabled: !!token,
    staleTime: 30_000,
  });
}

export function useIsFavorite(entityType: FavoriteEntityType, entityId: string) {
  const { data = [] } = useFavorites();
  return useMemo(
    () => data.some((f) => f.entityType === entityType && f.entityId === entityId),
    [data, entityType, entityId],
  );
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation<ToggleFavoriteResult, Error, ToggleFavoriteInput, { previous?: DbFavorite[] }>({
    mutationFn: (input) => toggleFavorite(token ?? "", input),
    onMutate: async (input) => {
      const key = favoritesKeys.list(userId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<DbFavorite[]>(key);
      queryClient.setQueryData<DbFavorite[]>(key, (current = []) => {
        const exists = current.find(
          (f) => f.entityType === input.entityType && f.entityId === input.entityId,
        );
        if (exists) {
          return current.filter((f) => f.id !== exists.id);
        }
        return [
          ...current,
          {
            id: `optimistic-${input.entityType}-${input.entityId}`,
            userId: userId ?? "",
            entityType: input.entityType,
            entityId: input.entityId,
            createdAt: new Date().toISOString(),
          },
        ];
      });
      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(favoritesKeys.list(userId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: favoritesKeys.list(userId) });
    },
  });
}
