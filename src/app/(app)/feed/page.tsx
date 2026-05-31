"use client";

import { useQuery } from "@tanstack/react-query";
import { Compass } from "lucide-react";
import DashboardShell from "../dashboard/components/shell";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { listFeed } from "@/lib/api/feed";
import { FeedCard } from "./components/feed-card";

export default function FeedPage() {
  const feed = useQuery({
    queryKey: ["feed"],
    queryFn: () => listFeed(),
    staleTime: 60_000,
  });

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
          </header>

          {feed.isPending && (
            <div className="flex flex-col gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} className="h-96" />
              ))}
            </div>
          )}

          {feed.isError && (
            <EmptyState
              title="Could not load the feed"
              action={
                <button
                  type="button"
                  onClick={() => feed.refetch()}
                  className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
                >
                  Retry
                </button>
              }
            />
          )}

          {feed.data && feed.data.length === 0 && (
            <EmptyState
              icon={<Compass className="h-6 w-6 text-sky-600" />}
              title="No posts yet"
              description="Follow travelers to see their stories appear here."
            />
          )}

          {feed.data && feed.data.length > 0 && (
            <div className="flex flex-col gap-6">
              {feed.data.map((post) => (
                <FeedCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
