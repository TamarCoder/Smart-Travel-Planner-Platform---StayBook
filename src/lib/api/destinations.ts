import data from "@/data/destinations.json";

export type Destination = (typeof data)[number];

export function getAllDestinations(): Destination[] {
  return data;
}

export function getFeaturedDestinations(): Destination[] {
  return data.filter((d) => d.featured);
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return data.find((d) => d.slug === slug);
}

export function getDestinationsByCategory(category: string): Destination[] {
  return data.filter((d) => d.category === category);
}

export function getCategories(): string[] {
  return [...new Set(data.map((d) => d.category))];
}
