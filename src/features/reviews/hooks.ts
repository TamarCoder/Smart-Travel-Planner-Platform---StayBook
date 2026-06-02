"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listReviews,
  createReview,
  type CreateReviewInput,
  type ReviewEntityType,
} from "@/lib/api/reviews";

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

export function useCreateReview(entityType: ReviewEntityType, entityId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<CreateReviewInput, "entityType" | "entityId">) =>
      createReview({ ...input, entityType, entityId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewsKeys.list(entityType, entityId) });
    },
  });
}
