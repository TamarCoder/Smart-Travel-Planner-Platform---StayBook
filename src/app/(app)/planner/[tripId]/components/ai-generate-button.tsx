"use client";

import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { useAddActivity, useTrip } from "@/features/trips";
import { useDestinationAttractions, useDestination } from "@/features/destinations";
import { Spinner } from "@/components/ui/spinner";
import { generateItineraryActivities } from "@/lib/ai/itinerary-generator";

interface AiGenerateButtonProps {
  tripId: string;
}

export function AiGenerateButton({ tripId }: AiGenerateButtonProps) {
  const [running, setRunning] = useState(false);
  const trip = useTrip(tripId);
  const destination = useDestination(trip.data?.destination);
  const attractions = useDestinationAttractions(destination.data?.id);
  const addActivity = useAddActivity();

  async function handleGenerate() {
    if (!trip.data) return;
    if (!attractions.data || attractions.data.length === 0) {
      toast.message("No attractions data for this destination yet.");
      return;
    }
    setRunning(true);
    try {
      const generated = generateItineraryActivities(trip.data.itinerary, attractions.data);
      if (generated.length === 0) {
        toast.message("Every day already has activities. Clear a day to generate more.");
        return;
      }
      for (const item of generated) {
        await addActivity.mutateAsync({
          tripId,
          dayIndex: item.dayIndex,
          activity: item.activity,
        });
      }
      toast.success(`AI generated ${generated.length} activities`, {
        description: "Drag to reorder or edit anything that needs a tweak.",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "AI ran into trouble");
    } finally {
      setRunning(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={running || trip.isPending}
      className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-violet-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60"
    >
      {running ? <Spinner className="h-3.5 w-3.5" /> : <Wand2 className="h-3.5 w-3.5" />}
      AI fill itinerary
      <Sparkles className="h-3 w-3 opacity-80" />
    </button>
  );
}
