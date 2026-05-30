"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getHotelById,
  getHotelsByDestination,
  listHotels,
  type HotelFilters,
} from "@/lib/api/hotels";
import { hotelsKeys } from "./keys";

export function useHotels(filters: HotelFilters = {}) {
  return useQuery({
    queryKey: hotelsKeys.list(filters),
    queryFn: () => listHotels(filters),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useHotel(id: string | undefined) {
  return useQuery({
    queryKey: hotelsKeys.detail(id ?? ""),
    queryFn: () => getHotelById(id as string),
    enabled: !!id,
  });
}

export function useHotelsByDestination(destinationId: string | undefined) {
  return useQuery({
    queryKey: hotelsKeys.byDestination(destinationId ?? ""),
    queryFn: () => getHotelsByDestination(destinationId as string),
    enabled: !!destinationId,
  });
}
