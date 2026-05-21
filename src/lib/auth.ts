import userData from "@/data/user.json";

export const MOCK_USER = userData;

export function mockLogin(email: string, password: string): boolean {
  return email === MOCK_USER.email && password === MOCK_USER.password;
}

export function setAuthSession() {
  localStorage.setItem("voyager_auth", "true");
}

export function clearAuthSession() {
  localStorage.removeItem("voyager_auth");
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("voyager_auth") === "true";
}
