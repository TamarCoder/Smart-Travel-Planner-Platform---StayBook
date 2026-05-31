"use client";

import Image from "next/image";
import Link from "next/link";
import { UserPlus, DollarSign, PlaneTakeoff, Leaf, Pencil, Ticket, Users, MoreHorizontal, CalendarRange } from "lucide-react";
import { useTrips } from "@/features/trips";
import { useAuthStore } from "@/stores";
import { SkeletonCard, SkeletonText } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { CreateTripDialog } from "./create-trip-dialog";
import type { TripActivityLog } from "@/lib/api/db";

function getActivityIcon(type: string) {
  if (type === "booking") return Ticket;
  if (type === "join" || type === "invite") return Users;
  return Pencil;
}

function daysUntil(date: string) {
  const diff = new Date(date).getTime() - Date.now();
  return Math.max(0, Math.round(diff / 86_400_000));
}

export default function DashboardMain() {
  const user = useAuthStore((s) => s.user);
  const trips = useTrips();

  return (
    <main className="lg:ml-64 pt-24 pb-16 min-h-screen bg-background px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <header
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
          style={{ animation: "fadeInUp 0.4s ease both" }}
        >
          <div>
            <h1
              className="font-semibold text-[2rem] leading-10 text-text-primary mb-1"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
            >
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-base text-text-secondary">
              {trips.isPending
                ? "Loading your trips…"
                : trips.data && trips.data.length > 0
                  ? upcomingHeadline(trips.data)
                  : "Start planning your next adventure."}
            </p>
          </div>
          <CreateTripDialog />
        </header>

        {trips.isPending ? (
          <DashboardSkeleton />
        ) : !trips.data || trips.data.length === 0 ? (
          <EmptyState
            icon={<CalendarRange className="h-6 w-6 text-sky-600" />}
            title="Your dashboard is empty"
            description="Create your first trip to see itineraries, budgets and analytics here."
            action={
              <CreateTripDialog
                trigger={
                  <button className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800">
                    Create trip
                  </button>
                }
              />
            }
          />
        ) : (
          <DashboardContent trips={trips.data} />
        )}
      </div>
    </main>
  );
}

function upcomingHeadline(trips: ReturnType<typeof useTrips>["data"] extends infer T ? T extends undefined ? never : T : never) {
  const upcoming = trips.find((t) => t.status === "upcoming") ?? trips[0];
  if (!upcoming) return "Start planning your next adventure.";
  const days = daysUntil(upcoming.startDate);
  if (days <= 0) return `${upcoming.title} is happening now.`;
  return `Your next adventure to ${upcoming.title} begins in ${days} days.`;
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-8 flex flex-col gap-6">
        <SkeletonText lines={1} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
      <div className="md:col-span-4 flex flex-col gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

interface DashboardContentProps {
  trips: NonNullable<ReturnType<typeof useTrips>["data"]>;
}

function DashboardContent({ trips }: DashboardContentProps) {
  const upcomingTrips = trips.filter((t) => t.status === "upcoming");
  const nextTrip = upcomingTrips[0] ?? trips[0];

  const totalSpent = trips.reduce((sum, t) => sum + t.spent, 0);
  const totalMiles = trips.reduce((sum, t) => sum + (t.milesMowed ?? 0), 0);
  const totalCarbon = trips.reduce((sum, t) => sum + (t.carbonFootprint ?? 0), 0);

  const budgetPct = nextTrip && nextTrip.totalBudget > 0
    ? Math.min(100, Math.round((nextTrip.spent / nextTrip.totalBudget) * 100))
    : 0;

  const analytics = [
    { label: "Total Spent", value: "$" + totalSpent.toLocaleString(), icon: DollarSign, delay: "0s" },
    { label: "Miles Flown", value: (totalMiles / 1000).toFixed(1) + "k", icon: PlaneTakeoff, delay: "0.1s" },
    { label: "Carbon Footprint", value: totalCarbon.toFixed(1) + " tCO2", icon: Leaf, delay: "0.2s" },
  ];

  const budgetBreakdown = nextTrip
    ? [
        { label: "Flights", amount: nextTrip.budgetBreakdown.flights ?? 0, color: "bg-sky-600" },
        { label: "Hotels", amount: nextTrip.budgetBreakdown.hotels ?? 0, color: "bg-sky-600/60" },
        { label: "Dining", amount: nextTrip.budgetBreakdown.dining ?? 0, color: "bg-sky-600/30" },
      ]
    : [];

  const recentActivity = (nextTrip?.recentActivity ?? []).slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <section className="md:col-span-8 flex flex-col gap-6" style={{ animation: "fadeInUp 0.4s ease 0.1s both" }}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
            Upcoming Trips
          </h2>
          <Link href="/planner" className="text-sm font-medium text-sky-600 hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(upcomingTrips.length > 0 ? upcomingTrips : trips.slice(0, 2)).map((trip) => (
            <Link
              key={trip.id}
              href={`/planner/${trip.id}`}
              className="bg-surface-elevated backdrop-blur-xl border border-border rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-48">
                <Image
                  src={trip.coverImage ?? "/assets/luxury_travel_planner_landing_page__img_03.png"}
                  alt={trip.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-text-primary">
                  {daysUntil(trip.startDate)} days left
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-text-primary mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  {trip.title}
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
                  {new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <div className="w-full bg-surface-hover h-1.5 rounded-full mb-1 overflow-hidden">
                  <div
                    className="bg-sky-600 h-full rounded-full transition-all duration-700"
                    style={{ width: trip.planningProgress + "%" }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-medium text-text-secondary">
                  <span>Planning Progress</span>
                  <span>{trip.planningProgress}%</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <aside className="md:col-span-4 flex flex-col gap-6" style={{ animation: "fadeInUp 0.4s ease 0.2s both" }}>
        <h2 className="text-2xl font-semibold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
          Analytics
        </h2>
        <div className="flex flex-col gap-4">
          {analytics.map(({ label, value, icon: Icon, delay }) => (
            <div
              key={label}
              className="bg-surface-elevated backdrop-blur-xl border border-border rounded-2xl p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ animation: `fadeInUp 0.4s ease ${delay} both` }}
            >
              <div>
                <p className="text-text-secondary text-sm font-medium mb-1">{label}</p>
                <h4 className="text-2xl font-bold text-text-primary">{value}</h4>
              </div>
              <div className="w-12 h-12 bg-sky-600/10 rounded-xl flex items-center justify-center text-sky-600">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {nextTrip && (
        <section
          className="md:col-span-6 bg-surface-elevated backdrop-blur-xl border border-border rounded-2xl p-6 flex flex-col gap-6"
          style={{ animation: "fadeInUp 0.4s ease 0.3s both" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
              Budget Overview
            </h2>
            <Link
              href={`/planner/${nextTrip.id}?view=budget`}
              className="text-text-secondary hover:text-sky-600 transition-colors"
              aria-label="Open budget"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Link>
          </div>
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-surface-hover" />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray="364.4"
                  strokeDashoffset={365 - (budgetPct / 100) * 365}
                  className="text-sky-600 transition-all duration-700"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-bold text-text-primary">{budgetPct}%</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {budgetBreakdown.map(({ label, amount, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="text-sm text-text-secondary">{label}</span>
                  </div>
                  <span className="text-sm font-bold text-text-primary">${amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        className="md:col-span-6 bg-surface-elevated backdrop-blur-xl border border-border rounded-2xl p-6 flex flex-col gap-6"
        style={{ animation: "fadeInUp 0.4s ease 0.4s both" }}
      >
        <h2 className="text-2xl font-semibold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
          Recent Activity
        </h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-text-secondary">No activity yet. Edits will appear here as you plan.</p>
        ) : (
          <div className="flex flex-col">
            {recentActivity.map((item: TripActivityLog, idx) => {
              const Icon = getActivityIcon(item.type);
              const isLast = idx === recentActivity.length - 1;
              return (
                <div key={item.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-sky-600/10 flex items-center justify-center text-sky-600 z-10 shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    {!isLast && <div className="w-px flex-1 bg-border-strong/30 mt-1 min-h-4" />}
                  </div>
                  <div className={isLast ? "pb-0" : "pb-5"}>
                    <p className="text-sm font-medium text-text-primary">{item.title}</p>
                    {item.subtitle && <p className="text-xs text-text-secondary mt-0.5">{item.subtitle}</p>}
                    <p className="text-[10px] text-text-muted mt-1">{formatTime(item.time)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {nextTrip && nextTrip.collaborators && nextTrip.collaborators.length > 0 && (
        <section className="md:col-span-12 flex items-center gap-4 rounded-2xl border border-border bg-surface-elevated px-6 py-4">
          <div className="flex -space-x-3">
            {nextTrip.collaborators.slice(0, 4).map((c) => (
              <div key={c.id} className="h-10 w-10 rounded-full border-2 border-surface bg-sky-500/20 overflow-hidden">
                {c.avatar ? (
                  <Image src={c.avatar} alt={c.name} width={40} height={40} className="h-full w-full object-cover" unoptimized />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-sky-700">
                    {c.name.charAt(0)}
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-text-secondary">
            {nextTrip.collaborators.length} {nextTrip.collaborators.length === 1 ? "person is" : "people are"} planning with you.
          </p>
          <Link href={`/planner/${nextTrip.id}`} className="ml-auto text-sm font-medium text-sky-600 hover:underline inline-flex items-center gap-1">
            <UserPlus className="h-4 w-4" />
            Manage
          </Link>
        </section>
      )}
    </div>
  );
}

function formatTime(iso: string) {
  try {
    const ms = Date.now() - new Date(iso).getTime();
    if (Number.isFinite(ms) && ms >= 0) {
      const minutes = Math.round(ms / 60_000);
      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.round(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.round(hours / 24);
      if (days < 30) return `${days}d ago`;
    }
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
}
