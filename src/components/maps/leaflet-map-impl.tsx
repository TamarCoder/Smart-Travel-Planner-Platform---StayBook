"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import L, { type LatLngBoundsLiteral } from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { useTheme } from "next-themes";
import { TILE_THEMES, type LatLng, type MapMarker, type MapRoute } from "./types";
import { cn } from "@/lib/utils";

interface LeafletMapImplProps {
  center: LatLng;
  zoom?: number;
  className?: string;
  markers?: MapMarker[];
  routes?: MapRoute[];
  fitToMarkers?: boolean;
  interactive?: boolean;
  flyTo?: LatLng | null;
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

function FitBounds({
  markers,
  routes,
  enabled,
}: {
  markers: MapMarker[];
  routes: MapRoute[];
  enabled: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!enabled) return;
    const points: LatLng[] = [
      ...markers.map((m) => m.position),
      ...routes.flatMap((r) => r.positions),
    ];
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], Math.max(map.getZoom(), 6));
      return;
    }
    const bounds: LatLngBoundsLiteral = points;
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
  }, [enabled, markers, routes, map]);

  return null;
}

function FlyTo({ position }: { position: LatLng | null | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (!position) return;
    map.flyTo(position, Math.max(map.getZoom(), 8), { duration: 1.2 });
  }, [position, map]);
  return null;
}

export function LeafletMapImpl({
  center,
  zoom = 4,
  className,
  markers = [],
  routes = [],
  fitToMarkers = false,
  interactive = true,
  flyTo,
  onMarkerClick,
}: LeafletMapImplProps) {
  const stableMarkers = useMemo(() => markers, [markers]);
  const stableRoutes = useMemo(() => routes, [routes]);

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
      <FitBounds markers={stableMarkers} routes={stableRoutes} enabled={fitToMarkers} />
      <FlyTo position={flyTo} />
      {stableRoutes.map((route) => (
        <Polyline
          key={route.id}
          positions={route.positions}
          pathOptions={{
            color: route.color ?? "#0ea5e9",
            weight: 4,
            opacity: 0.9,
            dashArray: route.dashed ? "8 8" : undefined,
            lineCap: "round",
            lineJoin: "round",
          }}
        >
          {route.label && <Tooltip sticky>{route.label}</Tooltip>}
        </Polyline>
      ))}
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
