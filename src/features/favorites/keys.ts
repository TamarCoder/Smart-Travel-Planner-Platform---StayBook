export const favoritesKeys = {
  all: ["favorites"] as const,
  list: (userId: string | null | undefined) =>
    [...favoritesKeys.all, "list", userId ?? "anon"] as const,
};
