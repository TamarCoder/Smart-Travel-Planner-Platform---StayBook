"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExpense,
  deleteExpense,
  listExpenses,
  updateExpense,
  type CreateExpenseInput,
  type Expense,
  type ExpenseMutationResult,
  type UpdateExpenseInput,
} from "@/lib/api/expenses";
import { tripsKeys } from "@/features/trips";
import { useAuthStore } from "@/stores";
import { expensesKeys } from "./keys";

export function useExpenses(options: { tripId?: string } = {}) {
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: expensesKeys.list({ userId, tripId: options.tripId }),
    queryFn: () => listExpenses(token ?? "", { tripId: options.tripId }),
    enabled: !!token,
    staleTime: 15_000,
  });
}

function syncTripCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  trip: ExpenseMutationResult["trip"],
  userId: string | null | undefined,
) {
  if (!trip) return;
  queryClient.setQueryData(tripsKeys.detail(trip.id), trip);
  queryClient.invalidateQueries({ queryKey: tripsKeys.list(userId) });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation<ExpenseMutationResult, Error, CreateExpenseInput>({
    mutationFn: (input) => createExpense(token ?? "", input),
    onSuccess: ({ trip }, variables) => {
      queryClient.invalidateQueries({ queryKey: expensesKeys.all });
      queryClient.invalidateQueries({
        queryKey: expensesKeys.list({ userId, tripId: variables.tripId }),
      });
      syncTripCaches(queryClient, trip, userId);
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation<ExpenseMutationResult, Error, UpdateExpenseInput>({
    mutationFn: (input) => updateExpense(token ?? "", input),
    onSuccess: ({ trip }) => {
      queryClient.invalidateQueries({ queryKey: expensesKeys.all });
      syncTripCaches(queryClient, trip, userId);
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation<{ tripId: string; trip: ExpenseMutationResult["trip"] }, Error, string>({
    mutationFn: (id) => deleteExpense(token ?? "", id),
    onSuccess: ({ trip }) => {
      queryClient.invalidateQueries({ queryKey: expensesKeys.all });
      syncTripCaches(queryClient, trip, userId);
    },
  });
}

export type { Expense };