"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Compass, Loader2 } from "lucide-react";
import DashboardShell from "../dashboard/components/shell";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";
import { listFeedPage } from "@/lib/api/feed";
import { FeedCard } from "./components/feed-card";
import { FeedComposer } from "./components/feed-composer";

export default function FeedPage() {
  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["feed", "infinite"],
    queryFn: ({ pageParam }) => listFeedPage(pageParam, 3),
    initialPageParam: 0,
    getNextPageParam: (last) => last.nextPage,
    staleTime: 60_000,
  });

  const posts = data?.pages.flatMap((page) => page.items) ?? [];
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "240px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div>
      <DashboardShell />
      <main className="pt-20 pb-16 lg:pl-64">
        <div className="mx-auto w-full max-w-2xl px-4 md:px-8">
          <header className="mb-8 text-center">
            <p className="text-sm font-medium text-sky-600">Community</p>
            <h1
              className="mt-2 text-3xl font-bold text-text-primary md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Traveler feed
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Real moments from people on the road. Follow, like, get inspired.
            </p>
            <div className="mt-5 flex justify-center">
              <FeedComposer />
            </div>
          </header>

          {isPending && (
            <div className="flex flex-col gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} className="h-96" />
              ))}
            </div>
          )}

          {isError && (
            <EmptyState
              title="Could not load the feed"
              action={
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
                >
                  Retry
                </button>
              }
            />
          )}

          {!isPending && !isError && posts.length === 0 && (
            <EmptyState
              icon={<Compass className="h-6 w-6 text-sky-600" />}
              title="No posts yet"
              description="Follow travelers to see their stories appear here."
            />
          )}

          {posts.length > 0 && (
            <div className="flex flex-col gap-6">
              {posts.map((post) => (
                <FadeIn key={post.id}>
                  <FeedCard post={post} />
                </FadeIn>
              ))}
            </div>
          )}

          <div ref={sentinelRef} className="h-px" />

          {isFetchingNextPage && (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
            </div>
          )}

          {hasNextPage && !isFetchingNextPage && posts.length > 0 && (
            <div className="flex justify-center py-6">
              <Button variant="secondary" size="sm" onClick={() => fetchNextPage()}>
                Load more
              </Button>
            </div>
          )}

          {!hasNextPage && posts.length > 0 && (
            <p className="py-8 text-center text-xs text-text-muted">
              You&apos;re all caught up.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
