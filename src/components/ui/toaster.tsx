"use client";

import { Toaster as Sonner } from "sonner";

function Toaster() {
  return (
    <Sonner
      position="top-right"
      gap={8}
      toastOptions={{
        classNames: {
          toast:
            "bg-surface border border-border shadow-xl rounded-lg px-4 py-3 flex gap-3 items-start",
          title: "text-text-primary font-semibold text-sm leading-snug",
          description: "text-text-secondary text-sm mt-0.5",
          actionButton: "bg-sky-500 text-white text-xs font-medium rounded-lg px-3 py-1.5 hover:bg-sky-600 transition-colors",
          cancelButton: "bg-surface-muted text-text-secondary text-xs font-medium rounded-lg px-3 py-1.5 hover:bg-surface-hover transition-colors",
          closeButton: "text-text-muted hover:text-text-primary transition-colors",
          error: "border-l-4 border-error",
          success: "border-l-4 border-success",
          warning: "border-l-4 border-warning",
          info: "border-l-4 border-info",
        },
      }}
    />
  );
}

export { Toaster };
