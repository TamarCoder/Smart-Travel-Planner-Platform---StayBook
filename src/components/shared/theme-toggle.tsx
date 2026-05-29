"use client";

import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Monitor, Moon, Sun, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
] as const;

interface ThemeToggleProps {
  className?: string;
  align?: "start" | "center" | "end";
}

export function ThemeToggle({ className, align = "end" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Toggle theme"
          className={cn(
            "relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary",
            className,
          )}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={8}
        className="z-50 min-w-40 rounded-xl border border-border bg-surface p-1 shadow-lg"
      >
        {OPTIONS.map(({ value, label, Icon }) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => setTheme(value)}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-text-primary outline-none transition-colors hover:bg-surface-muted focus:bg-surface-muted"
          >
            <span className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-text-secondary" />
              {label}
            </span>
            <span suppressHydrationWarning className="inline-flex h-4 w-4">
              {theme === value && <Check className="h-4 w-4 text-sky-500" />}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
