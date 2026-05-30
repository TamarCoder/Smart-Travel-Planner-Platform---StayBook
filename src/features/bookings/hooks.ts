"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelBooking,
  createBooking,
  deleteBooking,
  getBookingById,
  listBookings,
  type Booking,
  type CreateBookingInput,
} from "@/lib/api/bookings";
import { useAuthStore } from "@/stores";
import { bookingsKeys } from "./keys";

export function useBookings() {
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: bookingsKeys.list(userId),
    queryFn: () => listBookings(token ?? ""),
    enabled: !!token,
    staleTime: 30_000,
  });
}

export function useBooking(id: string | undefined) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: bookingsKeys.detail(id ?? ""),
    queryFn: () => getBookingById(token ?? "", id as string),
    enabled: !!token && !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation<Booking, Error, CreateBookingInput>({
    mutationFn: (input) => createBooking(token ?? "", input),
    onSuccess: (booking) => {
      queryClient.setQueryData(bookingsKeys.detail(booking.id), booking);
      queryClient.invalidateQueries({ queryKey: bookingsKeys.list(userId) });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation<Booking, Error, string>({
    mutationFn: (id) => cancelBooking(token ?? "", id),
    onSuccess: (booking) => {
      queryClient.setQueryData(bookingsKeys.detail(booking.id), booking);
      queryClient.invalidateQueries({ queryKey: bookingsKeys.list(userId) });
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteBooking(token ?? "", id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: bookingsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: bookingsKeys.list(userId) });
    },
  });
}
