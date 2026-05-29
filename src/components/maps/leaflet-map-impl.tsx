"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import L, { type LatLngBoundsLiteral } from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useTheme } from "next-themes";
import { TILE_THEMES, type LatLng, type MapMarker } from "./types";
import { cn } from "@/lib/utils";

interface LeafletMapImplProps {
  center: LatLng;
  zoom?: number;
  className?: string;
  markers?: MapMarker[];
  fitToMarkers?: boolean;
  interactive?: boolean;
  onMarkerClick?: (markerId: string) => void;
}

const FALLBACK_ICON = L.icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4Ij48cGF0aCBmaWxsPSIjMGVhNWU5IiBkPSJNMTIgMkM4LjEzIDIgNSA1LjEzIDUgOWMwIDUuMjUgNyAxMyA3IDEzczctNy43NSA3LTEzYzAtMy44Ny0zLjEzLTctNy03em0wIDkuNWMtMS4zOCAwLTIuNS0xLjEyLTIuNS0yLjVTMTAuNjIgNi41IDEyIDYuNXMyLjUgMS4xMiAyLjUgMi41LTEuMTIgMi41LTIuNSAyLjV6Ii8+PC9zdmc+",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -24],
});

function ThemeTiles() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? TILE_THEMES.dark : TILE_THEMES.light;
  return <TileLayer url={theme.url} attribution={theme.attribution} />;
}

function FitToMarkers({ markers, enabled }: { markers: MapMarker[]; enabled: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (!enabled || markers.length === 0) return;
    if (markers.length === 1) {
      map.setView(markers[0].position, Math.max(map.getZoom(), 6));
      return;
    }
    const bounds: LatLngBoundsLiteral = markers.map((m) => m.position);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
  }, [enabled, markers, map]);

  return null;
}

export function LeafletMapImpl({
  center,
  zoom = 4,
  className,
  markers = [],
  fitToMarkers = false,
  interactive = true,
  onMarkerClick,
}: LeafletMapImplProps) {
  const stableMarkers = useMemo(() => markers, [markers]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={cn("h-full w-full", className)}
      scrollWheelZoom={interactive}
      dragging={interactive}
      doubleClickZoom={interactive}
      zoomControl={interactive}
      attributionControl
    >
      <ThemeTiles />
      <FitToMarkers markers={stableMarkers} enabled={fitToMarkers} />
      {stableMarkers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          icon={FALLBACK_ICON}
          eventHandlers={{
            click: () => onMarkerClick?.(marker.id),
          }}
        >
          {(marker.title || marker.description) && (
            <Popup>
              <div className="space-y-1">
                {marker.title && (
                  <p className="text-sm font-semibold text-text-primary">{marker.title}</p>
                )}
                {marker.description && (
                  <p className="text-xs text-text-secondary">{marker.description}</p>
                )}
              </div>
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
}
