"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type ExploreView = "grid" | "map";

const PARAM = "view";

export function useExploreView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = (searchParams.get(PARAM) === "map" ? "map" : "grid") as ExploreView;

  const setView = useCallback(
    (next: ExploreView) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "map") {
        params.set(PARAM, "map");
      } else {
        params.delete(PARAM);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { view: value, setView };
}
