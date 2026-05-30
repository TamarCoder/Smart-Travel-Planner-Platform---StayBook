"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type PlannerView = "kanban" | "timeline" | "calendar" | "map";

const PARAM = "view";
const ALLOWED: PlannerView[] = ["kanban", "timeline", "calendar", "map"];

export function usePlannerView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const raw = searchParams.get(PARAM);
  const value: PlannerView = ALLOWED.includes(raw as PlannerView) ? (raw as PlannerView) : "kanban";

  const setView = useCallback(
    (next: PlannerView) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "kanban") {
        params.delete(PARAM);
      } else {
        params.set(PARAM, next);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { view: value, setView };
}
