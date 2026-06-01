import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  online?: boolean;
}

const sizeClasses: Record<string, string> = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-lg",
};

const sizePixels: Record<string, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

const indicatorClasses: Record<string, string> = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
  xl: "h-3.5 w-3.5",
};

function Avatar({
  className,
  src,
  alt,
  fallback,
  size = "md",
  online,
  ...props
}: AvatarProps) {
  const initials = fallback
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn("relative inline-flex shrink-0", className)}
      {...props}
    >
      <div
        className={cn(
          "rounded-full overflow-hidden flex items-center justify-center font-semibold",
          sizeClasses[size],
          !src && "bg-sky-500 text-white"
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt ?? fallback ?? "User avatar"}
            width={sizePixels[size]}
            height={sizePixels[size]}
            className="h-full w-full object-cover"
            unoptimized
          />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-surface",
            indicatorClasses[size],
            online ? "bg-success" : "bg-text-muted"
          )}
          aria-label={online ? "Online" : "Offline"}
        />
      )}
    </div>
  );
}

export { Avatar };
