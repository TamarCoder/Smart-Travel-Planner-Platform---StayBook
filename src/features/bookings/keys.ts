export const bookingsKeys = {
  all: ["bookings"] as const,
  list: (userId: string | null | undefined) =>
    [...bookingsKeys.all, "list", userId ?? "anon"] as const,
  detail: (id: string) => [...bookingsKeys.all, "detail", id] as const,
};
