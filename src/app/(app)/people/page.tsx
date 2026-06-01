"use client";

import { useQuery } from "@tanstack/react-query";
import { Globe2, UserMinus, UserPlus } from "lucide-react";
import DashboardShell from "../dashboard/components/shell";
import { Avatar } from "@/components/ui/avatar";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { FadeInList } from "@/components/shared/fade-in";
import { listPeople } from "@/lib/api/people";
import { useSocialStore } from "@/stores";
import { cn } from "@/lib/utils";

export default function PeoplePage() {
  const people = useQuery({
    queryKey: ["people"],
    queryFn: () => listPeople(),
    staleTime: 60_000,
  });

  return (
    <div>
      <DashboardShell />
      <main className="pt-20 pb-16 lg:pl-64">
        <div className="mx-auto w-full max-w-5xl px-4 md:px-10">
          <header className="mb-8">
            <p className="text-sm font-medium text-sky-600">Community</p>
            <h1
              className="mt-2 text-3xl font-bold text-text-primary md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Travelers worth following
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              Curated voices from the Voyager community. Follow them to see their trips appear in your feed.
            </p>
          </header>

          {people.isPending && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {people.isError && (
            <EmptyState
              title="Could not load travelers"
              action={
                <button
                  type="button"
                  onClick={() => people.refetch()}
                  className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
                >
                  Retry
                </button>
              }
            />
          )}

          {people.data && people.data.length > 0 && (
            <FadeInList as="ul" className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {people.data.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </FadeInList>
          )}
        </div>
      </main>
    </div>
  );
}

function PersonCard({ person }: { person: Awaited<ReturnType<typeof listPeople>>[number] }) {
  const following = useSocialStore((s) => Boolean(s.followedUserIds[person.id]));
  const toggleFollow = useSocialStore((s) => s.toggleFollow);

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-elevated p-5 shadow-sm">
      <header className="flex items-start gap-3">
        <Avatar src={person.avatar} fallback={person.name} size="lg" />
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-base font-semibold text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {person.name}
          </p>
          <p className="truncate text-xs text-text-secondary">{person.headline}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-text-muted">
            <Globe2 className="h-3 w-3" />
            {person.countriesVisited} countries · {person.tripsCount} trips
          </p>
        </div>
        <button
          type="button"
          onClick={() => toggleFollow(person.id)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
            following
              ? "border-border bg-surface text-text-secondary"
              : "border-navy-950 bg-navy-950 text-white hover:bg-navy-800",
          )}
        >
          {following ? <UserMinus className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
          {following ? "Following" : "Follow"}
        </button>
      </header>

      <p className="text-sm leading-relaxed text-text-secondary">{person.bio}</p>

      <footer className="flex items-center justify-between border-t border-border pt-3 text-xs">
        <div className="flex flex-wrap gap-1.5">
          {person.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-surface-muted px-2 py-0.5 font-medium text-text-secondary">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-text-muted">{person.followers.toLocaleString()} followers</p>
      </footer>
    </li>
  );
}
