"use client";

import Link from "next/link";
import { ArrowLeft, CalendarRange, Cloud, Plane, Sun, Wallet, Sparkles } from "lucide-react";
import { useDestination } from "@/features/destinations";
import { SkeletonCard, SkeletonText } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import ExploreShell from "../../components/shell";
import { HeroGallery } from "./hero-gallery";
import { AttractionsSection } from "./attractions-section";
import { RelatedSection } from "./related-section";
import { DestinationMap } from "./destination-map";

interface DestinationDetailProps {
  slug: string;
}

export function DestinationDetail({ slug }: DestinationDetailProps) {
  const { data, isPending, isError, refetch } = useDestination(slug);

  return (
    <div>
      <ExploreShell />
      <main className="pt-20 pb-16 lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-10">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to explore
          </Link>

          {isPending && <DetailSkeleton />}

          {isError && (
            <EmptyState
              className="mt-10"
              title="Destination not available"
              description="We couldn't load this destination. It may have been removed."
              action={
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
                >
                  Try again
                </button>
              }
            />
          )}

          {data && (
            <article className="mt-6 flex flex-col gap-12">
              <HeroGallery destination={data} />

              <section className="grid gap-10 lg:grid-cols-[1fr_320px]">
                <div className="flex flex-col gap-6">
                  <header>
                    <p className="text-sm font-medium text-sky-600">{data.category}</p>
                    <h2
                      className="mt-2 text-2xl font-bold text-text-primary md:text-3xl"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {data.tagline}
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-text-secondary md:text-base">
                      {data.description}
                    </p>
                  </header>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                      Why we love it
                    </h3>
                    <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {data.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-text-primary"
                        >
                          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {data.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <aside className="flex h-fit flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-text-muted">From</p>
                    <p
                      className="text-3xl font-bold text-text-primary"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {formatPrice(data.pricePerNight, data.currency)}
                      <span className="ml-1 text-sm font-medium text-text-secondary">/ night</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <Stat icon={<Sun className="h-4 w-4 text-sky-600" />} label="Weather">
                      {data.weather?.temp}°{data.weather?.unit} · {data.weather?.condition}
                    </Stat>
                    <Stat icon={<CalendarRange className="h-4 w-4 text-sky-600" />} label="Best season">
                      {data.bestSeason}
                    </Stat>
                    <Stat icon={<Plane className="h-4 w-4 text-sky-600" />} label="Getting there">
                      {data.flightTime}
                    </Stat>
                    <Stat icon={<Cloud className="h-4 w-4 text-sky-600" />} label="Stay length">
                      {data.duration ?? "Flexible"}
                    </Stat>
                  </div>

                  <Link
                    href={`/planner?destination=${data.slug}`}
                    className="mt-2 inline-flex items-center justify-center rounded-xl bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Plan a trip here
                  </Link>
                </aside>
              </section>

              <section className="flex flex-col gap-5">
                <header className="flex items-end justify-between">
                  <h3
                    className="text-2xl font-bold text-text-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Things to do
                  </h3>
                </header>
                <AttractionsSection destinationId={data.id} />
              </section>

              <DestinationMap destination={data} />

              <section className="flex flex-col gap-5">
                <header>
                  <h3
                    className="text-2xl font-bold text-text-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    You may also love
                  </h3>
                </header>
                <RelatedSection slug={data.slug} />
              </section>
            </article>
          )}
        </div>
      </main>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mt-6 flex flex-col gap-10">
      <SkeletonCard className="aspect-21/9 p-0" />
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <SkeletonText lines={4} />
          <SkeletonText lines={3} />
        </div>
        <SkeletonCard className="h-72" />
      </div>
    </div>
  );
}

interface StatProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

function Stat({ icon, label, children }: StatProps) {
  return (
    <div className="rounded-xl border border-border bg-surface-muted px-3 py-3">
      <div className="flex items-center gap-2 text-text-secondary">
        {icon}
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1 text-xs font-medium text-text-primary">{children}</p>
    </div>
  );
}

function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}
