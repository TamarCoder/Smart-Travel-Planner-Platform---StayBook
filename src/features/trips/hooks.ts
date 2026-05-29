"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addActivity,
  createTrip,
  deleteActivity,
  deleteTrip,
  getTrip,
  listTrips,
  moveActivity,
  reorderDayActivities,
  updateActivity,
  updateTrip,
  type AddActivityInput,
  type CreateTripInput,
  type DeleteActivityInput,
  type MoveActivityInput,
  type ReorderDayInput,
  type Trip,
  type UpdateActivityInput,
} from "@/lib/api/trips";
import type { DbTrip } from "@/lib/api/db";
import { useAuthStore } from "@/stores";
import { tripsKeys } from "./keys";

export function useTrips() {
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: tripsKeys.list(userId),
    queryFn: () => listTrips(token ?? ""),
    enabled: !!token,
    staleTime: 15_000,
  });
}

export function useTrip(id: string | undefined) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: tripsKeys.detail(id ?? ""),
    queryFn: () => getTrip(token ?? "", id as string),
    enabled: !!token && !!id,
  });
}

export function useUpcomingTrips() {
  const trips = useTrips();
  return {
    ...trips,
    data: trips.data?.filter((t) => t.status === "upcoming" || t.status === "active"),
  };
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation<Trip, Error, CreateTripInput>({
    mutationFn: (input) => createTrip(token ?? "", input),
    onSuccess: (trip) => {
      queryClient.setQueryData(tripsKeys.detail(trip.id), trip);
      queryClient.invalidateQueries({ queryKey: tripsKeys.list(userId) });
    },
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation<
    Trip,
    Error,
    { id: string; patch: Partial<Omit<DbTrip, "id" | "userId" | "createdAt">> }
  >({
    mutationFn: ({ id, patch }) => updateTrip(token ?? "", id, patch),
    onSuccess: (trip) => {
      queryClient.setQueryData(tripsKeys.detail(trip.id), trip);
      queryClient.invalidateQueries({ queryKey: tripsKeys.list(userId) });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteTrip(token ?? "", id),
    onSuccess: (_void, id) => {
      queryClient.removeQueries({ queryKey: tripsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: tripsKeys.list(userId) });
    },
  });
}

function mutateTripCache(
  queryClient: ReturnType<typeof useQueryClient>,
  tripId: string,
  updater: (trip: DbTrip) => DbTrip,
) {
  queryClient.setQueryData<DbTrip>(tripsKeys.detail(tripId), (prev) =>
    prev ? updater(prev) : prev,
  );
}

interface ActivityContext {
  previous?: DbTrip;
}

export function useAddActivity() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  return useMutation<Trip, Error, AddActivityInput, ActivityContext>({
    mutationFn: (input) => addActivity(token ?? "", input),
    onMutate: async (input) => {
      const key = tripsKeys.detail(input.tripId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<DbTrip>(key);
      if (previous) {
        const draft = structuredClone(previous);
        const day = draft.itinerary[input.dayIndex];
        if (day) {
          day.activities.push({
            id: input.activity.id ?? `optimistic-${Date.now()}`,
            type: input.activity.type,
            title: input.activity.title,
            time: input.activity.time,
            detail: input.activity.detail,
            status: input.activity.status ?? "pending",
            location: input.activity.location,
            coordinates: input.activity.coordinates,
            notes: input.activity.notes,
            cost: input.activity.cost,
            currency: input.activity.currency,
          });
        }
        queryClient.setQueryData(key, draft);
      }
      return { previous };
    },
    onError: (_error, input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(tripsKeys.detail(input.tripId), context.previous);
      }
    },
    onSuccess: (trip) => {
      queryClient.setQueryData(tripsKeys.detail(trip.id), trip);
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  return useMutation<Trip, Error, UpdateActivityInput, ActivityContext>({
    mutationFn: (input) => updateActivity(token ?? "", input),
    onMutate: async (input) => {
      const key = tripsKeys.detail(input.tripId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<DbTrip>(key);
      if (previous) {
        const draft = structuredClone(previous);
        const day = draft.itinerary[input.dayIndex];
        const idx = day?.activities.findIndex((a) => a.id === input.activityId) ?? -1;
        if (day && idx >= 0) {
          day.activities[idx] = { ...day.activities[idx], ...input.patch };
          queryClient.setQueryData(key, draft);
        }
      }
      return { previous };
    },
    onError: (_error, input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(tripsKeys.detail(input.tripId), context.previous);
      }
    },
    onSuccess: (trip) => {
      queryClient.setQueryData(tripsKeys.detail(trip.id), trip);
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  return useMutation<Trip, Error, DeleteActivityInput, ActivityContext>({
    mutationFn: (input) => deleteActivity(token ?? "", input),
    onMutate: async (input) => {
      const key = tripsKeys.detail(input.tripId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<DbTrip>(key);
      if (previous) {
        const draft = structuredClone(previous);
        const day = draft.itinerary[input.dayIndex];
        if (day) {
          day.activities = day.activities.filter((a) => a.id !== input.activityId);
          queryClient.setQueryData(key, draft);
        }
      }
      return { previous };
    },
    onError: (_error, input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(tripsKeys.detail(input.tripId), context.previous);
      }
    },
    onSuccess: (trip) => {
      queryClient.setQueryData(tripsKeys.detail(trip.id), trip);
    },
  });
}

export function useMoveActivity() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  return useMutation<Trip, Error, MoveActivityInput, ActivityContext>({
    mutationFn: (input) => moveActivity(token ?? "", input),
    onMutate: async (input) => {
      const key = tripsKeys.detail(input.tripId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<DbTrip>(key);
      if (previous) {
        const draft = structuredClone(previous);
        const from = draft.itinerary[input.fromDay];
        const to = draft.itinerary[input.toDay];
        const idx = from?.activities.findIndex((a) => a.id === input.activityId) ?? -1;
        if (from && to && idx >= 0) {
          const [activity] = from.activities.splice(idx, 1);
          const insertAt = Math.max(0, Math.min(input.toIndex, to.activities.length));
          to.activities.splice(insertAt, 0, activity);
          queryClient.setQueryData(key, draft);
        }
      }
      return { previous };
    },
    onError: (_error, input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(tripsKeys.detail(input.tripId), context.previous);
      }
    },
    onSuccess: (trip) => {
      queryClient.setQueryData(tripsKeys.detail(trip.id), trip);
    },
  });
}

export function useReorderDay() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  return useMutation<Trip, Error, ReorderDayInput, ActivityContext>({
    mutationFn: (input) => reorderDayActivities(token ?? "", input),
    onMutate: async (input) => {
      const key = tripsKeys.detail(input.tripId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<DbTrip>(key);
      mutateTripCache(queryClient, input.tripId, (trip) => {
        const draft = structuredClone(trip);
        const day = draft.itinerary[input.dayIndex];
        if (!day) return trip;
        const lookup = new Map(day.activities.map((a) => [a.id, a] as const));
        day.activities = input.orderedIds
          .map((id) => lookup.get(id))
          .filter((a): a is NonNullable<typeof a> => !!a);
        return draft;
      });
      return { previous };
    },
    onError: (_error, input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(tripsKeys.detail(input.tripId), context.previous);
      }
    },
    onSuccess: (trip) => {
      queryClient.setQueryData(tripsKeys.detail(trip.id), trip);
    },
  });
}
