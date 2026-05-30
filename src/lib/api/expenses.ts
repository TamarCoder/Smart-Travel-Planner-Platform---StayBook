import { nanoid } from "nanoid";
import {
  fakeRequest,
  notFound,
  unauthorized,
  validationError,
} from "./client";
import { ensureSeeded } from "./seed";
import {
  getDb,
  type DbExpense,
  type DbTrip,
  type StayBookDb,
} from "./db";
import type { IDBPDatabase } from "idb";

export type Expense = DbExpense;
export type ExpenseCategory = "flights" | "hotels" | "dining" | "activities" | "transport" | "other";

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "flights",
  "hotels",
  "dining",
  "activities",
  "transport",
  "other",
];

async function requireSession(token: string) {
  if (!token) unauthorized();
  const db = await getDb();
  const session = await db.get("sessions", token);
  if (!session) unauthorized("Session expired");
  return { db, userId: session.userId };
}

async function recomputeTripTotals(
  db: IDBPDatabase<StayBookDb>,
  tripId: string,
): Promise<DbTrip | null> {
  const trip = await db.get("trips", tripId);
  if (!trip) return null;
  const expenses = await db.getAllFromIndex("expenses", "by-trip", tripId);
  const breakdown: Record<string, number> = {
    flights: 0,
    hotels: 0,
    dining: 0,
    activities: 0,
    transport: 0,
    other: 0,
  };
  let spent = 0;
  expenses.forEach((expense) => {
    const key = breakdown[expense.category] !== undefined ? expense.category : "other";
    breakdown[key] = (breakdown[key] ?? 0) + expense.amount;
    spent += expense.amount;
  });
  const next: DbTrip = {
    ...trip,
    spent,
    budgetBreakdown: breakdown,
    updatedAt: new Date().toISOString(),
  };
  await db.put("trips", next);
  return next;
}

export interface ListExpensesOptions {
  tripId?: string;
}

export async function listExpenses(
  token: string,
  options: ListExpensesOptions = {},
): Promise<DbExpense[]> {
  await ensureSeeded();
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    if (options.tripId) {
      const list = await db.getAllFromIndex("expenses", "by-trip", options.tripId);
      return list.filter((e) => e.userId === userId);
    }
    const all = await db.getAllFromIndex("expenses", "by-user", userId);
    return all.sort((a, b) => (a.spentAt < b.spentAt ? 1 : -1));
  });
}

export interface CreateExpenseInput {
  tripId: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  note?: string;
  spentAt: string;
}

export interface ExpenseMutationResult {
  expense: DbExpense;
  trip: DbTrip | null;
}

export async function createExpense(
  token: string,
  input: CreateExpenseInput,
): Promise<ExpenseMutationResult> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    if (!input.tripId) validationError("Trip is required");
    if (!input.category) validationError("Category is required");
    if (!input.amount || input.amount <= 0) validationError("Amount must be positive");
    if (!input.spentAt) validationError("Date is required");

    const trip = await db.get("trips", input.tripId);
    if (!trip) notFound("Trip");
    if (trip.userId !== userId) notFound("Trip");

    const now = new Date().toISOString();
    const expense: DbExpense = {
      id: `exp-${nanoid(8)}`,
      tripId: input.tripId,
      userId,
      category: input.category,
      amount: input.amount,
      currency: input.currency,
      note: input.note?.trim() || undefined,
      spentAt: input.spentAt,
      createdAt: now,
    };
    await db.put("expenses", expense);
    const updatedTrip = await recomputeTripTotals(db, input.tripId);
    return { expense, trip: updatedTrip };
  });
}

export interface UpdateExpenseInput {
  id: string;
  patch: Partial<Pick<DbExpense, "category" | "amount" | "currency" | "note" | "spentAt">>;
}

export async function updateExpense(
  token: string,
  input: UpdateExpenseInput,
): Promise<ExpenseMutationResult> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const existing = await db.get("expenses", input.id);
    if (!existing) notFound("Expense");
    if (existing.userId !== userId) notFound("Expense");
    const next: DbExpense = {
      ...existing,
      ...input.patch,
      note: input.patch.note?.trim() || existing.note,
    };
    await db.put("expenses", next);
    const updatedTrip = await recomputeTripTotals(db, next.tripId);
    return { expense: next, trip: updatedTrip };
  });
}

export async function deleteExpense(
  token: string,
  id: string,
): Promise<{ tripId: string; trip: DbTrip | null }> {
  return fakeRequest(async () => {
    const { db, userId } = await requireSession(token);
    const existing = await db.get("expenses", id);
    if (!existing) return { tripId: "", trip: null };
    if (existing.userId !== userId) return { tripId: "", trip: null };
    await db.delete("expenses", id);
    const updatedTrip = await recomputeTripTotals(db, existing.tripId);
    return { tripId: existing.tripId, trip: updatedTrip };
  });
}
