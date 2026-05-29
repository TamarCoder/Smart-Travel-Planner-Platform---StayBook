"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  login,
  logout,
  register,
  updateProfile,
  type AuthResult,
  type AuthUser,
  type LoginInput,
  type RegisterInput,
} from "@/lib/api/auth";
import { useAuthStore } from "@/stores";
import { authKeys } from "./keys";

export function useMe() {
  const token = useAuthStore((s) => s.token);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      if (!token) return null;
      try {
        const user = await getCurrentUser(token);
        setSession(user, token);
        return user;
      } catch (error) {
        clearSession();
        throw error;
      }
    },
    enabled: !!token,
    staleTime: 60_000,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation<AuthResult, Error, LoginInput>({
    mutationFn: (input) => login(input),
    onSuccess: (result) => {
      setSession(result.user, result.token);
      queryClient.setQueryData(authKeys.me(), result.user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation<AuthResult, Error, RegisterInput>({
    mutationFn: (input) => register(input),
    onSuccess: (result) => {
      setSession(result.user, result.token);
      queryClient.setQueryData(authKeys.me(), result.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation<void, Error>({
    mutationFn: () => logout(token ?? ""),
    onSettled: () => {
      clearSession();
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const patchUser = useAuthStore((s) => s.patchUser);

  return useMutation<AuthUser, Error, Partial<Pick<AuthUser, "name" | "avatar" | "preferences">>>({
    mutationFn: (patch) => updateProfile(token ?? "", patch),
    onSuccess: (user) => {
      patchUser(user);
      queryClient.setQueryData(authKeys.me(), user);
    },
  });
}
