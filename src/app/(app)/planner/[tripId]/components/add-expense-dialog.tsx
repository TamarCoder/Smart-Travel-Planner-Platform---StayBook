"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useCreateExpense } from "@/features/expenses";
import { EXPENSE_CATEGORIES, type ExpenseCategory } from "@/lib/api/expenses";
import { CURRENCIES } from "@/lib/utils/currency";

const schema = z.object({
  category: z.enum(EXPENSE_CATEGORIES as [ExpenseCategory, ...ExpenseCategory[]]),
  amount: z.number().min(0.01, "Amount must be positive"),
  currency: z.string().min(3).max(3),
  spentAt: z.string().min(1, "Pick a date"),
  note: z.string().max(160).optional(),
});

type FormInput = z.infer<typeof schema>;

interface AddExpenseDialogProps {
  tripId: string;
  defaultCurrency?: string;
}

export function AddExpenseDialog({ tripId, defaultCurrency = "USD" }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const createExpense = useCreateExpense();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: "activities",
      amount: 0,
      currency: defaultCurrency,
      spentAt: new Date().toISOString().slice(0, 10),
      note: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createExpense.mutateAsync({
        tripId,
        category: values.category,
        amount: Number(values.amount),
        currency: values.currency,
        note: values.note,
        spentAt: values.spentAt,
      });
      toast.success("Expense saved");
      reset();
      setOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not save expense";
      toast.error(message);
    }
  });

  const busy = isSubmitting || createExpense.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-navy-950 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-navy-800"
        >
          <Plus className="h-4 w-4" />
          Add expense
        </button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-display)" }}>Log a new expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-xs font-medium text-text-secondary">Category</label>
              <select
                id="category"
                {...register("category")}
                className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm capitalize outline-none focus:border-sky-600"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">{c}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="spentAt" className="text-xs font-medium text-text-secondary">Date</label>
              <input
                id="spentAt"
                type="date"
                {...register("spentAt")}
                className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-sky-600"
              />
              {errors.spentAt && <p className="text-xs text-error-dark">{errors.spentAt.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_120px]">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="amount" className="text-xs font-medium text-text-secondary">Amount</label>
              <input
                id="amount"
                type="number"
                step={0.01}
                min={0}
                {...register("amount", { valueAsNumber: true })}
                className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-sky-600"
              />
              {errors.amount && <p className="text-xs text-error-dark">{errors.amount.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="currency" className="text-xs font-medium text-text-secondary">Currency</label>
              <select
                id="currency"
                {...register("currency")}
                className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-sky-600"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="note" className="text-xs font-medium text-text-secondary">Note</label>
            <input
              id="note"
              type="text"
              placeholder="Sunset dinner at Selene"
              maxLength={160}
              {...register("note")}
              className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-sky-600"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-medium text-text-secondary hover:bg-surface-hover"
              >
                <X className="h-3.5 w-3.5" /> Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-navy-950 px-5 py-2.5 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
            >
              {busy ? <Spinner className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              Save expense
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}