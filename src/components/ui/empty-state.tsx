import { cn } from "@/lib/utils";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-6 py-16 gap-4",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-surface-muted text-text-muted">
          {icon}
        </div>
      )}
      <div className="space-y-1.5 max-w-sm">
        <p className="text-base font-semibold text-text-primary">{title}</p>
        {description && (
          <p className="text-sm text-text-secondary">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export { EmptyState };
