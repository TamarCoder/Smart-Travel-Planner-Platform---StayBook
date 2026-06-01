export type LatLng = [number, number];

export type MarkerAccent = "sky" | "emerald" | "amber" | "rose" | "navy" | "violet";

export type MarkerKind = "pin" | "dot" | "price";

export interface MapMarker {
  id: string;
  position: LatLng;
  title?: string;
  description?: string;
  image?: string;
  href?: string;
  accent?: MarkerAccent;
  label?: string;
  kind?: MarkerKind;
  meta?: string;
}

export interface MapRoute {
  id: string;
  positions: LatLng[];
  color?: string;
  label?: string;
  dashed?: boolean;
}

export const ROUTE_COLORS = [
  "#00668a",
  "#009668",
  "#565e74",
  "#40c2fd",
  "#131b2e",
  "#f59e0b",
  "#7a7289",
] as const;

export function routeColorForIndex(index: number) {
  return ROUTE_COLORS[index % ROUTE_COLORS.length];
}

export interface MapTheme {
  url: string;
  attribution: string;
}

export const TILE_THEMES = {
  light: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
} as const satisfies Record<string, MapTheme>;
