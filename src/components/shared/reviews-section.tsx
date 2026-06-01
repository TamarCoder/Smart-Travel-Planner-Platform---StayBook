"use client";

import { useMemo, useState } from "react";
import { Star, PenLine } from "lucide-react";
import { toast } from "sonner";
import {
  useReviews,
  useCreateReview,
  summariseReviews,
  type ReviewEntityType,
} from "@/features/reviews";
import { useAuthStore } from "@/stores";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  const [writing, setWriting] = useState(false);

  return (
    <section className={cn("flex flex-col gap-6", className)}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-text-secondary">
          {summary.count > 0
            ? `${summary.average.toFixed(1)} average from ${summary.count} reviews`
            : "No reviews yet"}
        </p>
        {!writing && (
          <Button variant="secondary" size="sm" onClick={() => setWriting(true)}>
            <PenLine className="h-4 w-4" />
            Write a review
          </Button>
        )}
      </div>

      {writing && (
        <WriteReviewForm
          entityType={entityType}
          entityId={entityId}
          onDone={() => setWriting(false)}
        />
      )}

      {isPending ? (
        <SkeletonText lines={3} />
      ) : !data || data.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-surface-muted/40 p-6 text-center text-sm text-text-secondary">
          Be the first to share your experience.
        </p>
      ) : (
        <>
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
        </>
      )}
    </section>
  );
}

interface WriteReviewFormProps {
  entityType: ReviewEntityType;
  entityId: string;
  onDone: () => void;
}

function WriteReviewForm({ entityType, entityId, onDone }: WriteReviewFormProps) {
  const user = useAuthStore((s) => s.user);
  const create = useCreateReview(entityType, entityId);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const canSubmit =
    rating > 0 && title.trim().length > 0 && body.trim().length > 0 && !create.isPending;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    try {
      await create.mutateAsync({
        rating,
        title,
        body,
        authorName: user?.name ?? "Anonymous traveler",
        authorAvatar: user?.avatar,
      });
      toast.success("Review published");
      setTitle("");
      setBody("");
      setRating(5);
      onDone();
    } catch {
      toast.error("Could not publish review. Try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm"
    >
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            aria-checked={rating === n}
            role="radio"
            className="p-0.5"
          >
            <Star
              className={cn(
                "h-6 w-6 transition-colors",
                n <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-border",
              )}
            />
          </button>
        ))}
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Sum up your experience"
        maxLength={80}
        className="rounded-xl bg-surface-muted px-4 py-2.5 text-sm text-text-primary outline-none transition focus:ring-2 focus:ring-secondary"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What stood out — the location, the service, the little details?"
        rows={4}
        maxLength={600}
        className="resize-none rounded-xl bg-surface-muted px-4 py-2.5 text-sm text-text-primary outline-none transition focus:ring-2 focus:ring-secondary"
      />

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" size="sm" loading={create.isPending} disabled={!canSubmit}>
          Publish review
        </Button>
      </div>
    </form>
  );
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
}
