import apiClient from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { User, AuthTokens, ApiResponse } from "@/types";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthData {
  user: User;
  tokens: AuthTokens;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthData> {
    const res = await apiClient.post<ApiResponse<AuthData>>(
      ENDPOINTS.auth.login,
      payload
    );
    return res.data.data;
  },

  async register(payload: RegisterPayload): Promise<AuthData> {
    const res = await apiClient.post<ApiResponse<AuthData>>(
      ENDPOINTS.auth.register,
      payload
    );
    return res.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post(ENDPOINTS.auth.logout);
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>(ENDPOINTS.auth.me);
    return res.data.data;
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    const res = await apiClient.post<ApiResponse<{ accessToken: string; expiresIn: number }>>(
      ENDPOINTS.auth.refresh,
      { refreshToken }
    );
    return res.data.data;
  },
};
