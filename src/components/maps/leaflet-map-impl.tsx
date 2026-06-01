"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import L, { type LatLngBoundsLiteral } from "leaflet";
import Image from "next/image";
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
import {
  TILE_THEMES,
  type LatLng,
  type MapMarker,
  type MapRoute,
  type MarkerAccent,
  type MarkerKind,
} from "./types";
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

const ACCENT_HEX: Record<MarkerAccent, string> = {
  sky: "#00668a",
  emerald: "#009668",
  amber: "#f59e0b",
  rose: "#f43f5e",
  navy: "#131b2e",
  violet: "#8b5cf6",
};

function buildIcon(marker: MapMarker) {
  const accent = ACCENT_HEX[marker.accent ?? "sky"];
  const kind: MarkerKind = marker.kind ?? "pin";
  const isUser = marker.id === "user-location";

  if (kind === "dot" || isUser) {
    const html = `<div class="map-pin map-pin--dot ${isUser ? "map-pin--user" : ""}" style="--accent:${accent}"></div>`;
    return L.divIcon({
      html,
      className: "",
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -10],
    });
  }

  if (kind === "price" && marker.label) {
    const html = `<div class="map-pin map-pin--price" style="--accent:${accent}">${marker.label}</div>`;
    return L.divIcon({
      html,
      className: "",
      iconSize: [60, 28],
      iconAnchor: [30, 28],
      popupAnchor: [0, -24],
    });
  }

  const html = `<div class="map-pin" style="--accent:${accent}">${marker.label ?? ""}</div>`;
  return L.divIcon({
    html,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32],
  });
}

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

function MarkerPopup({ marker }: { marker: MapMarker }) {
  if (!marker.title && !marker.description && !marker.image) return null;
  return (
    <Popup closeButton={false}>
      <div className="overflow-hidden rounded-xl">
        {marker.image && (
          <div className="relative h-28 w-full">
            <Image
              src={marker.image}
              alt={marker.title ?? ""}
              fill
              sizes="240px"
              className="object-cover"
            />
          </div>
        )}
        <div className="space-y-1 p-3">
          {marker.title && (
            <p className="text-sm font-semibold text-text-primary">{marker.title}</p>
          )}
          {marker.description && (
            <p className="text-xs text-text-secondary">{marker.description}</p>
          )}
          {marker.meta && (
            <p className="text-xs font-medium text-sky-600">{marker.meta}</p>
          )}
        </div>
      </div>
    </Popup>
  );
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
          icon={buildIcon(marker)}
          eventHandlers={{
            click: () => onMarkerClick?.(marker.id),
          }}
        >
          <MarkerPopup marker={marker} />
        </Marker>
      ))}
    </MapContainer>
  );
}
