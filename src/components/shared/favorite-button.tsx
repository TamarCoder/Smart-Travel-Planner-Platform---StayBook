"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import {
  useIsFavorite,
  useToggleFavorite,
} from "@/features/favorites";
import type { FavoriteEntityType } from "@/lib/api/favorites";
import { useAuthStore } from "@/stores";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  entityType: FavoriteEntityType;
  entityId: string;
  className?: string;
  size?: "sm" | "md";
  label?: string;
}

export function FavoriteButton({
  entityType,
  entityId,
  className,
  size = "md",
  label,
}: FavoriteButtonProps) {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const isFavorited = useIsFavorite(entityType, entityId);
  const toggle = useToggleFavorite();

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const padding = size === "sm" ? "p-1.5" : "p-2";

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (status !== "authenticated") {
      toast.message("Sign in to save favorites", {
        action: {
          label: "Sign in",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    toggle.mutate(
      { entityType, entityId },
      {
        onSuccess: (result) => {
          toast.success(result.favorited ? "Saved to favorites" : "Removed from favorites");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isFavorited}
      aria-label={label ?? (isFavorited ? "Remove from favorites" : "Save to favorites")}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-white/90 shadow-md transition-transform hover:scale-110 disabled:opacity-60",
        padding,
        className,
      )}
      disabled={toggle.isPending}
    >
      <Heart
        className={cn(
          iconSize,
          "transition-colors",
          isFavorited ? "fill-rose-500 text-rose-500" : "text-text-secondary",
        )}
      />
    </button>
  );
}
