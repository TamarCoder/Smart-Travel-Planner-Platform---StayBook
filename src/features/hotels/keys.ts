import type { HotelFilters } from "@/lib/api/hotels";

export const hotelsKeys = {
  all: ["hotels"] as const,
  list: (filters: HotelFilters) => [...hotelsKeys.all, "list", filters] as const,
  detail: (id: string) => [...hotelsKeys.all, "detail", id] as const,
  byDestination: (destinationId: string) =>
    [...hotelsKeys.all, "byDestination", destinationId] as const,
};
