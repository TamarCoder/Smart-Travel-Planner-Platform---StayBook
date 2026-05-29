"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useLogin } from "@/features/auth";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "alex@voyager.com", password: "voyager2024" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values);
      toast.success("Welcome back");
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : "/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Try again.";
      toast.error(message);
    }
  });

  const busy = isSubmitting || login.isPending;

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-text-primary mb-2"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          Welcome back
        </h1>
        <p className="text-text-secondary text-sm">
          Sign in to continue planning your journey.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-text-primary">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
            <input
              id="email"
              type="email"
              placeholder="alex@voyager.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
              className="w-full rounded-xl bg-surface border border-border pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 aria-invalid:border-error"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-error-dark">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-text-primary">
              Password
            </label>
            <Link href="#" className="text-xs text-sky-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              {...register("password")}
              className="w-full rounded-xl bg-surface border border-border pl-10 pr-11 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 aria-invalid:border-error"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-error-dark">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={busy}
          className="mt-1 w-full py-3 rounded-xl bg-navy-950 hover:bg-navy-800 text-white text-sm font-semibold transition-all hover:-translate-y-px hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-xs text-text-muted">or continue with</span>
          </div>
        </div>

        <button
          type="button"
          className="w-full py-3 rounded-xl bg-surface border border-border hover:border-border-strong text-text-primary text-sm font-medium transition-all flex items-center justify-center gap-3 hover:shadow-sm"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Don&rsquo;t have an account?{" "}
        <Link href="/register" className="text-sky-600 font-semibold hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
