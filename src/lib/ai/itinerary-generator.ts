import { nanoid } from "nanoid";
import type { Attraction } from "@/lib/api/destinations";
import type { TripActivity, TripDay } from "@/lib/api/db";

interface SlotTemplate {
  time: string;
  type: TripActivity["type"];
}

const DEFAULT_SLOTS: SlotTemplate[] = [
  { time: "09:00", type: "tour" },
  { time: "12:30", type: "dining" },
  { time: "15:00", type: "activity" },
  { time: "19:00", type: "dining" },
];

function pickType(category: string | undefined): TripActivity["type"] {
  if (!category) return "activity";
  const lower = category.toLowerCase();
  if (lower.includes("food") || lower.includes("drink")) return "dining";
  if (lower.includes("hike") || lower.includes("trail")) return "tour";
  if (lower.includes("scenic")) return "tour";
  if (lower.includes("wildlife") || lower.includes("marine")) return "activity";
  if (lower.includes("cultural")) return "tour";
  if (lower.includes("adventure")) return "activity";
  if (lower.includes("experience")) return "activity";
  if (lower.includes("history")) return "tour";
  return "activity";
}

export interface GeneratedActivity {
  dayIndex: number;
  activity: Omit<TripActivity, "id"> & { id: string };
}

export function generateItineraryActivities(
  days: TripDay[],
  attractions: Attraction[],
): GeneratedActivity[] {
  if (days.length === 0 || attractions.length === 0) return [];

  const pool = [...attractions].sort((a, b) => b.rating - a.rating);
  const slotsPerDay = 3;
  const generated: GeneratedActivity[] = [];

  let cursor = 0;
  days.forEach((day, dayIndex) => {
    const existing = day.activities.length;
    const remainingSlots = Math.max(0, slotsPerDay - existing);
    for (let i = 0; i < remainingSlots; i++) {
      const attraction = pool[cursor % pool.length];
      cursor++;
      const slot = DEFAULT_SLOTS[(existing + i) % DEFAULT_SLOTS.length];
      const type = pickType(attraction.category);
      generated.push({
        dayIndex,
        activity: {
          id: `act-${nanoid(8)}`,
          time: slot.time,
          type,
          title: attraction.name,
          detail: attraction.description.split(".").slice(0, 1).join(".") + ".",
          status: "pending",
          coordinates: attraction.coordinates,
          notes: `Suggested by AI · ${attraction.duration}`,
        },
      });
    }
  });

  return generated;
}
