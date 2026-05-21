import { http, HttpResponse, delay } from "msw";
import { generateAccessToken, generateRefreshToken } from "@/features/auth/lib/generateToken";
import usersDb from "@/mocks/db/users.json";
import type { User } from "@/types";

const users = usersDb as (User & { password: string })[];

export const authHandlers = [
  http.post("/api/auth/login", async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as { email: string; password: string };

    const user = users.find((u) => u.email === body.email);
    if (!user || body.password !== user.password) {
      return HttpResponse.json(
        { message: "Invalid credentials", code: "INVALID_CREDENTIALS", status: 401 },
        { status: 401 }
      );
    }

    const { password: _, ...safeUser } = user;
    return HttpResponse.json({
      data: {
        user: safeUser,
        tokens: {
          accessToken: generateAccessToken(user.id, user.email),
          refreshToken: generateRefreshToken(user.id),
          expiresIn: 3600,
        },
      },
    });
  }),

  http.post("/api/auth/register", async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { email: string; password: string; name: string };

    const exists = users.find((u) => u.email === body.email);
    if (exists) {
      return HttpResponse.json(
        { message: "Email already registered", code: "EMAIL_IN_USE", status: 409 },
        { status: 409 }
      );
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      email: body.email,
      name: body.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(body.name)}&background=0ea5e9&color=fff&size=96`,
      role: "user",
      createdAt: new Date().toISOString(),
      preferences: {
        currency: "USD",
        language: "en",
        darkMode: false,
        notifications: true,
      },
    };

    return HttpResponse.json({
      data: {
        user: newUser,
        tokens: {
          accessToken: generateAccessToken(newUser.id, newUser.email),
          refreshToken: generateRefreshToken(newUser.id),
          expiresIn: 3600,
        },
      },
    });
  }),

  http.post("/api/auth/refresh", async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as { refreshToken: string };

    if (!body.refreshToken) {
      return HttpResponse.json(
        { message: "No refresh token provided", code: "NO_TOKEN", status: 401 },
        { status: 401 }
      );
    }

    const userId = `usr_refresh_${Date.now()}`;
    return HttpResponse.json({
      data: {
        accessToken: generateAccessToken(userId, "refreshed@user.com"),
        expiresIn: 3600,
      },
    });
  }),

  http.post("/api/auth/logout", async () => {
    await delay(150);
    return HttpResponse.json({ data: { success: true } });
  }),

  http.get("/api/auth/me", async ({ request }) => {
    await delay(250);
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return HttpResponse.json(
        { message: "Unauthorized", code: "UNAUTHORIZED", status: 401 },
        { status: 401 }
      );
    }

    const user = users[0];
    const { password: _, ...safeUser } = user;
    return HttpResponse.json({ data: safeUser });
  }),
];
