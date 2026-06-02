import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold leading-none transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-sky-500/10 text-sky-500",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        error: "bg-error/10 text-error",
        neutral: "bg-surface-muted text-text-secondary",
        premium: "text-white",
      },
      size: {
        sm: "px-3 py-1 text-xs",
        md: "px-4 py-1.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, style, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      style={
        variant === "premium"
          ? {
              background: "linear-gradient(135deg, #131b2e 0%, #00668a 100%)",
              ...style,
            }
          : style
      }
      {...props}
    />
  );
}

export { Badge, badgeVariants };
