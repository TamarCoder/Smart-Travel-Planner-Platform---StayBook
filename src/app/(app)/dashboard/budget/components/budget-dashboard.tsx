"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plane, TrendingDown, Wallet } from "lucide-react";
import { useExpenses } from "@/features/expenses";
import { useTrips } from "@/features/trips";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonCard } from "@/components/ui/skeleton";
import { formatMoney, convert } from "@/lib/utils/currency";
import { usePreferredCurrency } from "@/hooks/use-preferred-currency";
import { CategoryDonut } from "./category-donut";
import { TripBarChart } from "./trip-bar-chart";
import { cn } from "@/lib/utils";

export function BudgetDashboard() {
  const currency = usePreferredCurrency();
  const trips = useTrips();
  const [tripFilter, setTripFilter] = useState<string | "all">("all");
  const expenses = useExpenses(tripFilter === "all" ? {} : { tripId: tripFilter });

  const filteredTrips = useMemo(() => {
    if (tripFilter === "all") return trips.data ?? [];
    return (trips.data ?? []).filter((t) => t.id === tripFilter);
  }, [trips.data, tripFilter]);

  const totalBudget = filteredTrips.reduce((sum, t) => sum + convert(t.totalBudget, "USD", currency), 0);
  const totalSpent = filteredTrips.reduce((sum, t) => sum + convert(t.spent, "USD", currency), 0);
  const remaining = Math.max(0, totalBudget - totalSpent);

  const categoryBuckets = useMemo(() => {
    const map = new Map<string, number>();
    filteredTrips.forEach((t) => {
      Object.entries(t.budgetBreakdown ?? {}).forEach(([category, amount]) => {
        map.set(category, (map.get(category) ?? 0) + convert(amount, "USD", currency));
      });
    });
    return Array.from(map.entries())
      .map(([category, amount]) => ({ category, amount }))
      .filter((d) => d.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTrips, currency]);

  const tripBars = useMemo(() => {
    return (trips.data ?? []).map((t) => ({
      trip: t.title.length > 14 ? `${t.title.slice(0, 14)}…` : t.title,
      spent: Math.round(convert(t.spent, "USD", currency)),
      budget: Math.round(convert(t.totalBudget, "USD", currency)),
    }));
  }, [trips.data, currency]);

  const topExpenses = useMemo(() => {
    const items = (expenses.data ?? []).slice().sort((a, b) => b.amount - a.amount);
    return items.slice(0, 5);
  }, [expenses.data]);

  if (trips.isPending) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (trips.isError) {
    return (
      <EmptyState
        title="Could not load budgets"
        action={
          <button
            type="button"
            onClick={() => trips.refetch()}
            className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Retry
          </button>
        }
      />
    );
  }

  if (!trips.data?.length) {
    return (
      <EmptyState
        icon={<Wallet className="h-6 w-6 text-sky-600" />}
        title="No budgets yet"
        description="Create a trip to start tracking expenses and budgets."
        action={
          <Link
            href="/dashboard"
            className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Go to dashboard
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setTripFilter("all")}
          className={chipClass(tripFilter === "all")}
        >
          All trips
        </button>
        {trips.data?.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTripFilter(t.id)}
            className={chipClass(tripFilter === t.id)}
          >
            {t.title}
          </button>
        ))}
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard icon={<Wallet className="h-4 w-4 text-sky-600" />} label="Planned budget" value={formatMoney(totalBudget, currency)} />
        <StatCard
          icon={<ArrowUpRight className="h-4 w-4 text-amber-500" />}
          label="Spent so far"
          value={formatMoney(totalSpent, currency)}
          accent={totalSpent / totalBudget > 0.8 ? "warning" : undefined}
        />
        <StatCard
          icon={<TrendingDown className="h-4 w-4 text-emerald-500" />}
          label="Remaining"
          value={formatMoney(remaining, currency)}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_3fr]">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-text-primary">Where the money goes</h2>
          </div>
          {categoryBuckets.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-border bg-surface-muted/40 p-6 text-center text-sm text-text-secondary">
              Log expenses to populate the breakdown.
            </div>
          ) : (
            <div className="mt-6">
              <CategoryDonut data={categoryBuckets} currency={currency} />
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-base font-semibold text-text-primary">Trip budgets at a glance</h2>
          <p className="mt-1 text-xs text-text-secondary">Spent vs. planned across your trips.</p>
          <div className="mt-6">
            <TripBarChart data={tripBars} currency={currency} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">Top expenses</h2>
          {expenses.isPending && <Spinner className="h-4 w-4 text-sky-500" />}
        </div>
        {topExpenses.length === 0 ? (
          <p className="mt-4 text-sm text-text-secondary">No expenses logged yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {topExpenses.map((e) => {
              const trip = trips.data?.find((t) => t.id === e.tripId);
              return (
                <li key={e.id} className="flex items-center gap-4 py-3 text-sm">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
                    <Plane className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-text-primary">{e.note ?? e.category}</p>
                    <p className="text-xs text-text-secondary">
                      {trip?.title ?? "Trip"} · {e.spentAt}
                    </p>
                  </div>
                  <p className="font-semibold text-text-primary">
                    {formatMoney(convert(e.amount, e.currency, currency), currency)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: "warning";
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-text-muted">
        {icon}
        {label}
      </div>
      <p
        className={cn(
          "mt-3 text-2xl font-bold text-text-primary",
          accent === "warning" && "text-amber-600",
        )}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </p>
    </div>
  );
}

function chipClass(active: boolean) {
  return cn(
    "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
    active
      ? "border-navy-950 bg-navy-950 text-white"
      : "border-border bg-surface text-text-secondary hover:border-border-strong",
  );
}