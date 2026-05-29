"use client";

import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/spinner";

export const LeafletMap = dynamic(
  () => import("./leaflet-map-impl").then((m) => m.LeafletMapImpl),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[280px] w-full items-center justify-center rounded-2xl bg-surface-muted">
        <Spinner className="h-6 w-6 text-sky-500" />
      </div>
    ),
  },
);
