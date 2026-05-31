"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const handle = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    };

    if (document.readyState === "complete") {
      handle();
    } else {
      window.addEventListener("load", handle, { once: true });
    }

    return () => {
      window.removeEventListener("load", handle);
    };
  }, []);

  return null;
}
