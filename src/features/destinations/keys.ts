import type { DestinationFilters } from "@/lib/api/destinations";

export const destinationsKeys = {
  all: ["destinations"] as const,
  list: (filters: DestinationFilters) =>
    [...destinationsKeys.all, "list", filters] as const,
  featured: () => [...destinationsKeys.all, "featured"] as const,
  detail: (slug: string) => [...destinationsKeys.all, "detail", slug] as const,
  related: (slug: string) => [...destinationsKeys.all, "related", slug] as const,
  attractions: (destinationId: string) =>
    [...destinationsKeys.all, "attractions", destinationId] as const,
  categories: () => [...destinationsKeys.all, "categories"] as const,
  activities: () => [...destinationsKeys.all, "activities"] as const,
};
