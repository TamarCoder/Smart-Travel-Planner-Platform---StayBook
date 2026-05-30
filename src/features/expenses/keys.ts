export const expensesKeys = {
  all: ["expenses"] as const,
  list: (filters: { userId?: string | null; tripId?: string }) =>
    [...expensesKeys.all, "list", filters.tripId ?? "all", filters.userId ?? "anon"] as const,
};