"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-[#191c1e] mb-2"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          Welcome back
        </h1>
        <p className="text-[#45464d] text-sm">
          Sign in to continue planning your journey.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-[#191c1e]">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#76777d] pointer-events-none" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              className="w-full rounded-xl bg-white border border-[#e0e3e5] pl-10 pr-4 py-3 text-sm text-[#191c1e] placeholder:text-[#76777d] outline-none transition-all focus:border-[#00668a] focus:ring-2 focus:ring-[#00668a]/20"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-[#191c1e]">
              Password
            </label>
            <Link href="#" className="text-xs text-[#00668a] hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#76777d] pointer-events-none" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              className="w-full rounded-xl bg-white border border-[#e0e3e5] pl-10 pr-11 py-3 text-sm text-[#191c1e] placeholder:text-[#76777d] outline-none transition-all focus:border-[#00668a] focus:ring-2 focus:ring-[#00668a]/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#76777d] hover:text-[#191c1e] transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full py-3 rounded-xl bg-[#000] hover:bg-[#131b2e] text-white text-sm font-semibold transition-all hover:-translate-y-px hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e0e3e5]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#f7f9fb] px-3 text-xs text-[#76777d]">or continue with</span>
          </div>
        </div>

        <button
          type="button"
          className="w-full py-3 rounded-xl bg-white border border-[#e0e3e5] hover:border-[#c6c6cd] text-[#191c1e] text-sm font-medium transition-all flex items-center justify-center gap-3 hover:shadow-sm"
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

      <p className="mt-6 text-center text-sm text-[#45464d]">
        Don't have an account?{" "}
        <Link href="/register" className="text-[#00668a] font-semibold hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
