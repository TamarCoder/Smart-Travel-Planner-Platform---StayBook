"use client";

import { useMemo } from "react";
import { Star } from "lucide-react";
import { useReviews, summariseReviews, type ReviewEntityType } from "@/features/reviews";
import { Avatar } from "@/components/ui/avatar";
import { SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ReviewsSectionProps {
  entityType: ReviewEntityType;
  entityId: string;
  className?: string;
}

export function ReviewsSection({ entityType, entityId, className }: ReviewsSectionProps) {
  const { data, isPending } = useReviews(entityType, entityId);
  const summary = useMemo(() => summariseReviews(data ?? []), [data]);

  if (isPending) {
    return (
      <section className={className}>
        <SkeletonText lines={3} />
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className={cn("rounded-2xl border border-dashed border-border bg-surface-muted/40 p-6 text-center text-sm text-text-secondary", className)}>
        Be the first to share your experience.
      </section>
    );
  }

  return (
    <section className={cn("flex flex-col gap-6", className)}>
      <header className="grid gap-6 md:grid-cols-[200px_1fr]">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface p-6 text-center">
          <p
            className="text-4xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {summary.average.toFixed(1)}
          </p>
          <div className="mt-2 flex">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={cn(
                  "h-4 w-4",
                  n <= Math.round(summary.average) ? "fill-amber-400 text-amber-400" : "text-border",
                )}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-text-secondary">{summary.count} reviews</p>
        </div>

        <ul className="flex flex-col gap-2">
          {summary.breakdown.map((row) => {
            const pct = summary.count > 0 ? (row.count / summary.count) * 100 : 0;
            return (
              <li key={row.stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-text-secondary">{row.stars} stars</span>
                <div className="flex-1 h-2 rounded-full bg-surface-muted overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-10 text-right text-text-muted">{row.count}</span>
              </li>
            );
          })}
        </ul>
      </header>

      <ul className="flex flex-col gap-4">
        {data.map((review) => (
          <li
            key={review.id}
            className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
          >
            <header className="flex items-start gap-3">
              <Avatar src={review.authorAvatar} fallback={review.authorName} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {review.authorName}
                  </p>
                  <span className="text-[10px] uppercase tracking-wider text-text-muted">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={cn(
                        "h-3.5 w-3.5",
                        n <= Math.round(review.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-border",
                      )}
                    />
                  ))}
                </div>
              </div>
            </header>
            <h4 className="mt-3 text-sm font-semibold text-text-primary">{review.title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">{review.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
}
