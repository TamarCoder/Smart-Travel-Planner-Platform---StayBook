import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, hint, error, leadingIcon, trailingIcon, id, ...props },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leadingIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full rounded-lg bg-surface-muted px-4 py-3 text-sm text-text-primary placeholder:text-text-muted",
              "transition-all duration-200 outline-none",
              "focus:bg-surface focus:ring-2 focus:ring-sky-500",
              error && "ring-2 ring-error focus:ring-error",
              leadingIcon && "pl-10",
              trailingIcon && "pr-10",
              className
            )}
            {...props}
          />
          {trailingIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {trailingIcon}
            </span>
          )}
        </div>
        {hint && (
          <p
            className={cn(
              "text-xs",
              error ? "text-error" : "text-text-muted"
            )}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
