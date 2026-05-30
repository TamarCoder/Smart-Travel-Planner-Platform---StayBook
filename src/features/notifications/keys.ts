export const notificationsKeys = {
  all: ["notifications"] as const,
  list: (userId: string | null | undefined) =>
    [...notificationsKeys.all, "list", userId ?? "anon"] as const,
};
