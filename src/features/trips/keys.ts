export const tripsKeys = {
  all: ["trips"] as const,
  list: (userId: string | null | undefined) =>
    [...tripsKeys.all, "list", userId ?? "anon"] as const,
  detail: (id: string) => [...tripsKeys.all, "detail", id] as const,
};
