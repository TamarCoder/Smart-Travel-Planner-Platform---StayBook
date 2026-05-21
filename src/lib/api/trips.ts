import data from "@/data/trips.json";

export type Trip = (typeof data)[number];

export function getAllTrips(): Trip[] {
  return data;
}

export function getTripById(id: string): Trip | undefined {
  return data.find((t) => t.id === id);
}

export function getUpcomingTrips(): Trip[] {
  return data.filter((t) => t.status === "upcoming");
}
