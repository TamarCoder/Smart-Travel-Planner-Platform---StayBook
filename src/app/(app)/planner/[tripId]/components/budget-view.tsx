"use client";

import { useMemo } from "react";
import { Trash2, Plane, Hotel, Utensils, Sparkles, Car, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useExpenses, useDeleteExpense } from "@/features/expenses";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { convert, formatMoney } from "@/lib/utils/currency";
import { usePreferredCurrency } from "@/hooks/use-preferred-currency";
import { cn } from "@/lib/utils";
import type { DbTrip } from "@/lib/api/db";
import { AddExpenseDialog } from "./add-expense-dialog";

const CATEGORY_ORDER = ["flights", "hotels", "dining", "activities", "transport", "other"] as const;
const CATEGORY_ICONS: Record<string, typeof Plane> = {
  flights: Plane,
  hotels: Hotel,
  dining: Utensils,
  activities: Sparkles,
  transport: Car,
  other: MoreHorizontal,
};
const CATEGORY_COLORS: Record<string, string> = {
  flights: "bg-sky-500",
  hotels: "bg-violet-500",
  dining: "bg-orange-500",
  activities: "bg-emerald-500",
  transport: "bg-amber-500",
  other: "bg-slate-500",
};

interface BudgetViewProps {
  trip: DbTrip;
}

export function BudgetView({ trip }: BudgetViewProps) {
  const currency = usePreferredCurrency();
  const expenses = useExpenses({ tripId: trip.id });
  const deleteExpense = useDeleteExpense();

  const budgetTotal = convert(trip.totalBudget, "USD", currency);
  const spent = convert(trip.spent, "USD", currency);
  const remaining = Math.max(0, budgetTotal - spent);
  const pct = budgetTotal > 0 ? Math.min(100, Math.round((spent / budgetTotal) * 100)) : 0;

  const categoryRows = useMemo(() => {
    const totals = trip.budgetBreakdown ?? {};
    const all = new Set<string>([...CATEGORY_ORDER, ...Object.keys(totals)]);
    return Array.from(all).map((category) => {
      const amount = convert(totals[category] ?? 0, "USD", currency);
      const share = spent > 0 ? Math.round((amount / spent) * 100) : 0;
      return { category, amount, share };
    });
  }, [trip.budgetBreakdown, spent, currency]);

  const sortedExpenses = useMemo(
    () => (expenses.data ?? []).slice().sort((a, b) => (a.spentAt < b.spentAt ? 1 : -1)),
    [expenses.data],
  );

  async function handleDelete(id: string) {
    try {
      await deleteExpense.mutateAsync(id);
      toast.success("Expense removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted">Total budget</p>
            <p className="mt-1 text-3xl font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
              {formatMoney(budgetTotal, currency)}
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              {formatMoney(spent, currency)} spent · {formatMoney(remaining, currency)} remaining
            </p>
          </div>
          <AddExpenseDialog tripId={trip.id} defaultCurrency={currency} />
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              pct >= 100 ? "bg-rose-500" : pct >= 80 ? "bg-amber-500" : "bg-sky-500",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] uppercase tracking-wider text-text-muted">{pct}% of budget used</p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h3 className="text-base font-semibold text-text-primary">Where it goes</h3>
        <ul className="mt-4 space-y-3">
          {categoryRows.map((row) => {
            const Icon = CATEGORY_ICONS[row.category] ?? MoreHorizontal;
            const color = CATEGORY_COLORS[row.category] ?? "bg-slate-500";
            const barPct = spent > 0 ? Math.min(100, (row.amount / spent) * 100) : 0;
            return (
              <li key={row.category} className="flex items-center gap-4 text-sm">
                <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-xl text-white", color)}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-text-primary">
                    <p className="font-medium capitalize">{row.category}</p>
                    <p>{formatMoney(row.amount, currency)}</p>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                    <div className={cn("h-full rounded-full", color)} style={{ width: `${barPct}%` }} />
                  </div>
                </div>
                <span className="w-10 text-right text-xs text-text-secondary">{row.share}%</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-text-primary">Expense log</h3>
          {expenses.isPending && <Spinner className="h-4 w-4 text-sky-500" />}
        </div>

        {!expenses.isPending && sortedExpenses.length === 0 ? (
          <EmptyState
            className="py-10"
            title="No expenses yet"
            description="Track every spend to keep this trip on budget."
            action={<AddExpenseDialog tripId={trip.id} defaultCurrency={currency} />}
          />
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {sortedExpenses.map((expense) => {
              const Icon = CATEGORY_ICONS[expense.category] ?? MoreHorizontal;
              const color = CATEGORY_COLORS[expense.category] ?? "bg-slate-500";
              return (
                <li key={expense.id} className="flex items-center gap-4 py-3 text-sm">
                  <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-xl text-white", color)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-text-primary capitalize">
                      {expense.note ?? expense.category}
                    </p>
                    <p className="text-xs text-text-secondary">{expense.spentAt}</p>
                  </div>
                  <p className="font-semibold text-text-primary">
                    {formatMoney(convert(expense.amount, expense.currency, currency), currency)}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDelete(expense.id)}
                    disabled={deleteExpense.isPending}
                    className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-error-bg hover:text-error-dark"
                    aria-label="Delete expense"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}