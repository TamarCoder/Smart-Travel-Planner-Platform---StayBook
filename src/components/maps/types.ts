export type LatLng = [number, number];

export interface MapMarker {
  id: string;
  position: LatLng;
  title?: string;
  description?: string;
  href?: string;
  accent?: "sky" | "emerald" | "amber" | "rose";
  label?: string;
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
