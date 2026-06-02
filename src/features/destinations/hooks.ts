"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getAttractionsByDestination,
  getAvailableActivities,
  getCategories,
  getDestinationBySlug,
  getFeaturedDestinations,
  getRelatedDestinations,
  listDestinations,
  type DestinationFilters,
} from "@/lib/api/destinations";
import { destinationsKeys } from "./keys";

export function useDestinations(filters: DestinationFilters = {}) {
  return useQuery({
    queryKey: destinationsKeys.list(filters),
    queryFn: () => listDestinations(filters),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useFeaturedDestinations(limit?: number) {
  return useQuery({
    queryKey: destinationsKeys.featured(),
    queryFn: () => getFeaturedDestinations(limit),
    staleTime: 60_000,
  });
}

export function useDestination(slug: string | undefined) {
  return useQuery({
    queryKey: destinationsKeys.detail(slug ?? ""),
    queryFn: () => getDestinationBySlug(slug as string),
    enabled: !!slug,
  });
}

export function useRelatedDestinations(slug: string | undefined, limit?: number) {
  return useQuery({
    queryKey: destinationsKeys.related(slug ?? ""),
    queryFn: () => getRelatedDestinations(slug as string, limit),
    enabled: !!slug,
  });
}

export function useDestinationAttractions(destinationId: string | undefined) {
  return useQuery({
    queryKey: destinationsKeys.attractions(destinationId ?? ""),
    queryFn: () => getAttractionsByDestination(destinationId as string),
    enabled: !!destinationId,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: destinationsKeys.categories(),
    queryFn: () => getCategories(),
    staleTime: Infinity,
  });
}

export function useActivities() {
  return useQuery({
    queryKey: destinationsKeys.activities(),
    queryFn: () => getAvailableActivities(),
    staleTime: Infinity,
  });
}
