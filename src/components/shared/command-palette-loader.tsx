"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useUiStore } from "@/stores";

const CommandPalette = dynamic(
  () => import("./command-palette").then((m) => m.CommandPalette),
  { ssr: false, loading: () => null },
);

export function CommandPaletteLoader() {
  const open = useUiStore((s) => s.commandPaletteOpen);
  const toggle = useUiStore((s) => s.toggleCommandPalette);
  const [primed, setPrimed] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const meta = isMac ? event.metaKey : event.ctrlKey;
      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPrimed(true);
        toggle();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  if (!primed && !open) return null;
  return <CommandPalette />;
}
