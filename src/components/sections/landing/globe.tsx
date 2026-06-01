"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { useTheme } from "next-themes";
import destinationsData from "@/data/destinations.json";
import type { Destination } from "@/lib/api/destinations";

const DESTINATIONS = destinationsData as Destination[];

export function GlobeSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!canvasRef.current) return;
    const dark = resolvedTheme === "dark";
    const markers = DESTINATIONS.filter((d) => d.coordinates).map((d) => ({
      location: [d.coordinates!.lat, d.coordinates!.lng] as [number, number],
      size: d.featured ? 0.08 : 0.05,
    }));

    const handleResize = () => {
      if (canvasRef.current) widthRef.current = canvasRef.current.offsetWidth;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: typeof window !== "undefined" ? window.devicePixelRatio : 2,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: 0,
      theta: 0.25,
      dark: dark ? 1 : 0,
      diffuse: 1.2,
      mapSamples: 16_000,
      mapBrightness: dark ? 6 : 4,
      baseColor: dark ? [0.1, 0.15, 0.25] : [0.95, 0.96, 0.98],
      markerColor: [0, 0.4, 0.54],
      glowColor: dark ? [0.1, 0.3, 0.42] : [0.8, 0.92, 0.96],
      markers,
      onRender: ((state: Record<string, number>) => {
        state.phi = phiRef.current;
        phiRef.current += 0.0035;
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;
      }) as never,
    } as Parameters<typeof createGlobe>[1]);

    return () => {
      globe.destroy();
      window.removeEventListener("resize", handleResize);
    };
  }, [resolvedTheme]);

  return (
    <section className="py-12 md:py-20 px-4 md:px-12 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">
            Around the world
          </p>
          <h2
            className="mt-3 font-bold text-text-primary"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              lineHeight: "1.15",
            }}
          >
            Every destination in one place
          </h2>
          <p className="mt-4 text-sm md:text-base text-text-secondary leading-relaxed">
            Spin the globe and discover where Voyager travelers are heading next.
            From the volcanic cliffs of Santorini to the fjords of Milford Sound.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-text-secondary">
            {DESTINATIONS.slice(0, 6).map((d) => (
              <li key={d.id} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                {d.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md">
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", contain: "layout paint size" }}
            aria-label="Rotating globe with destination markers"
          />
        </div>
      </div>
    </section>
  );
}
