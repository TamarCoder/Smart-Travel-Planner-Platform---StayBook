import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthStatus = "idle" | "authenticated" | "unauthenticated";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  preferences?: {
    currency: string;
    travelStyle: string[];
    notifications: boolean;
  };
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  status: AuthStatus;
  setSession: (user: AuthUser, token: string) => void;
  clearSession: () => void;
  patchUser: (patch: Partial<AuthUser>) => void;
  setStatus: (status: AuthStatus) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      status: "idle",
      setSession: (user, token) => set({ user, token, status: "authenticated" }),
      clearSession: () => set({ user: null, token: null, status: "unauthenticated" }),
      patchUser: (patch) =>
        set((state) => ({ user: state.user ? { ...state.user, ...patch } : state.user })),
      setStatus: (status) => set({ status }),
    }),
    {
      name: "staybook.auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.status = state.token && state.user ? "authenticated" : "unauthenticated";
      },
    },
  ),
);

export const selectIsAuthenticated = (state: AuthState) => state.status === "authenticated";
export const selectAuthUser = (state: AuthState) => state.user;
