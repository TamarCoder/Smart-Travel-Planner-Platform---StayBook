"use client";

import { useQuery } from "@tanstack/react-query";
import { listReviews, type ReviewEntityType } from "@/lib/api/reviews";

export const reviewsKeys = {
  all: ["reviews"] as const,
  list: (entityType: ReviewEntityType, entityId: string) =>
    [...reviewsKeys.all, entityType, entityId] as const,
};

export function useReviews(entityType: ReviewEntityType, entityId: string | undefined) {
  return useQuery({
    queryKey: reviewsKeys.list(entityType, entityId ?? ""),
    queryFn: () => listReviews(entityType, entityId as string),
    enabled: !!entityId,
    staleTime: 60_000,
  });
}
