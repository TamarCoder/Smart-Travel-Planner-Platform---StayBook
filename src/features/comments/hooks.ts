"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  deleteComment,
  listComments,
  toggleReaction,
  type Comment,
  type CreateCommentInput,
  type ToggleReactionInput,
} from "@/lib/api/comments";
import { useAuthStore } from "@/stores";
import { broadcast } from "@/lib/realtime/channel";
import { commentsRoom } from "@/features/realtime/rooms";
import { commentsKeys } from "./keys";

export function useTripComments(tripId: string | undefined) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: commentsKeys.byTrip(tripId ?? ""),
    queryFn: () => listComments(token ?? "", { tripId: tripId as string }),
    enabled: !!token && !!tripId,
    staleTime: 15_000,
  });
}

function emitCommentEvent(tripId: string, type: string) {
  const name = useAuthStore.getState().user?.name;
  broadcast(commentsRoom(tripId), type, { tripId }, name);
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  return useMutation<Comment, Error, CreateCommentInput>({
    mutationFn: (input) => createComment(token ?? "", input),
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: commentsKeys.byTrip(comment.tripId) });
      queryClient.invalidateQueries({ queryKey: commentsKeys.byActivity(comment.activityId) });
      emitCommentEvent(comment.tripId, "comment:added");
    },
  });
}

export function useDeleteComment(tripId: string) {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteComment(token ?? "", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsKeys.byTrip(tripId) });
      emitCommentEvent(tripId, "comment:deleted");
    },
  });
}

export function useToggleReaction(tripId: string) {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  return useMutation<Comment, Error, ToggleReactionInput>({
    mutationFn: (input) => toggleReaction(token ?? "", input),
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: commentsKeys.byTrip(comment.tripId) });
      queryClient.invalidateQueries({ queryKey: commentsKeys.byActivity(comment.activityId) });
      emitCommentEvent(tripId, "comment:reacted");
    },
  });
}
