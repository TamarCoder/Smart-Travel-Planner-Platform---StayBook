import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-sky-500 text-white hover:bg-sky-600 shadow-sm hover:shadow-md hover:-translate-y-px active:translate-y-0",
        secondary:
          "border border-navy-950 text-navy-950 bg-transparent hover:bg-surface-muted dark:border-white dark:text-white dark:hover:bg-surface-hover",
        ghost:
          "bg-transparent text-navy-950 hover:bg-sky-500/10 dark:text-white dark:hover:bg-sky-500/10",
        destructive:
          "bg-error text-white hover:bg-error-dark shadow-sm hover:shadow-md",
      },
      size: {
        sm: "h-8 px-4 text-xs rounded-lg",
        md: "h-10 px-6 text-sm rounded-xl",
        lg: "h-12 px-8 text-base rounded-xl",
        icon: "h-10 w-10 rounded-md shrink-0",
        "icon-sm": "h-8 w-8 rounded-md shrink-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
