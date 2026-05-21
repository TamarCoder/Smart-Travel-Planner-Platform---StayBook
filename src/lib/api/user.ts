import data from "@/data/user.json";

export type User = typeof data;

export function getCurrentUser(): User {
  return data;
}
