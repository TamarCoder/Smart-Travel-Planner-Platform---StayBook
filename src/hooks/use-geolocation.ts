"use client";

import { useCallback, useState } from "react";

export type GeolocationStatus = "idle" | "loading" | "success" | "error" | "unsupported";

export interface GeolocationPosition {
  lat: number;
  lng: number;
  accuracy: number;
}

interface GeolocationState {
  status: GeolocationStatus;
  position: GeolocationPosition | null;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    status: "idle",
    position: null,
    error: null,
  });

  const request = useCallback((options?: PositionOptions) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setState({ status: "unsupported", position: null, error: "Geolocation not available" });
      return;
    }
    setState((prev) => ({ ...prev, status: "loading", error: null }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          status: "success",
          position: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          },
          error: null,
        });
      },
      (err) => {
        setState({ status: "error", position: null, error: err.message });
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000, ...options },
    );
  }, []);

  const reset = useCallback(() => {
    setState({ status: "idle", position: null, error: null });
  }, []);

  return { ...state, request, reset };
}
