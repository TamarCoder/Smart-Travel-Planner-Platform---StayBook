import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthTokens } from "@/types";

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  setAuth: (user: User, tokens: AuthTokens) => void;
  updateUser: (user: Partial<User>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,

      setAuth: (user, tokens) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("staybook_access_token", tokens.accessToken);
          localStorage.setItem("staybook_refresh_token", tokens.refreshToken);
        }
        set({ user, tokens, isAuthenticated: true });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("staybook_access_token");
          localStorage.removeItem("staybook_refresh_token");
        }
        set({ user: null, tokens: null, isAuthenticated: false });
      },
    }),
    {
      name: "staybook_auth",
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
