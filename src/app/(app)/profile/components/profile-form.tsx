"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useBrowserNotify } from "@/features/notifications";
import { useLogout, useUpdateProfile } from "@/features/auth";
import { useAuthStore } from "@/stores";
import { profileSchema, type ProfileInput } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";
import { AvatarUpload } from "./avatar-upload";

const TRAVEL_STYLES = [
  "Luxury",
  "Adventure",
  "Cultural",
  "Wellness",
  "Family",
  "Solo",
  "Foodie",
  "Eco",
];

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD"];

export function ProfileForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();
  const logout = useLogout();
  const browserNotify = useBrowserNotify(user?.preferences?.notifications ?? false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      travelStyle: user?.preferences?.travelStyle ?? [],
      currency: user?.preferences?.currency ?? "USD",
      notifications: user?.preferences?.notifications ?? true,
    },
  });

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name,
      travelStyle: user.preferences?.travelStyle ?? [],
      currency: user.preferences?.currency ?? "USD",
      notifications: user.preferences?.notifications ?? true,
    });
  }, [user, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateProfile.mutateAsync({
        name: values.name,
        preferences: {
          travelStyle: values.travelStyle,
          currency: values.currency,
          notifications: values.notifications,
        },
      });
      toast.success("Profile saved");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not save. Try again.";
      toast.error(message);
    }
  });

  async function handleAvatarUpload(dataUrl: string) {
    await updateProfile.mutateAsync({ avatar: dataUrl });
  }

  async function handleLogout() {
    await logout.mutateAsync();
    router.push("/login");
  }

  const busy = isSubmitting || updateProfile.isPending;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 md:py-16">
      <header className="mb-10">
        <p className="text-sm font-medium text-sky-600">Account</p>
        <h1
          className="mt-2 text-3xl font-bold text-text-primary md:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your profile
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Personalise how Voyager shapes your recommendations and notifications.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <AvatarUpload
          name={user?.name}
          avatar={user?.avatar}
          onUpload={handleAvatarUpload}
        />
      </section>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-8" noValidate>
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-text-primary">Identity</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium text-text-primary">
                Full name
              </label>
              <input
                id="name"
                type="text"
                aria-invalid={!!errors.name}
                {...register("name")}
                className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 aria-invalid:border-error"
              />
              {errors.name && (
                <p className="text-xs text-error-dark">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Email</label>
              <input
                type="email"
                value={user?.email ?? ""}
                disabled
                className="rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-text-muted"
              />
              <p className="text-xs text-text-muted">Email cannot be changed in this build.</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-text-primary">Travel preferences</h2>
          <p className="mt-1 text-sm text-text-secondary">
            We tailor recommendations and budgets to your style.
          </p>

          <div className="mt-6 flex flex-col gap-6">
            <Controller
              name="travelStyle"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-text-primary">Travel style</span>
                  <div className="flex flex-wrap gap-2">
                    {TRAVEL_STYLES.map((style) => {
                      const active = field.value.includes(style);
                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={() =>
                            field.onChange(
                              active
                                ? field.value.filter((s) => s !== style)
                                : [...field.value, style],
                            )
                          }
                          className={cn(
                            "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
                            active
                              ? "border-sky-600 bg-sky-500/10 text-sky-700"
                              : "border-border text-text-secondary hover:border-border-strong",
                          )}
                        >
                          {style}
                        </button>
                      );
                    })}
                  </div>
                  {errors.travelStyle && (
                    <p className="text-xs text-error-dark">{errors.travelStyle.message}</p>
                  )}
                </div>
              )}
            />

            <div className="flex flex-col gap-1.5 md:max-w-xs">
              <label htmlFor="currency" className="text-sm font-medium text-text-primary">
                Preferred currency
              </label>
              <select
                id="currency"
                {...register("currency")}
                className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <Controller
              name="notifications"
              control={control}
              render={({ field }) => (
                <label className="flex items-start gap-3 rounded-xl border border-border bg-surface-muted px-4 py-3">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                    className="mt-1 h-4 w-4 accent-sky-600"
                  />
                  <span className="text-sm">
                    <span className="block font-medium text-text-primary">In-app notifications</span>
                    <span className="block text-text-secondary">
                      Trip reminders, collaboration updates, and price alerts.
                    </span>
                  </span>
                </label>
              )}
            />

            <div className="rounded-xl border border-border bg-surface-muted px-4 py-3">
              <div className="flex items-start gap-3">
                <Bell className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">Browser notifications</p>
                  <p className="text-xs text-text-secondary">
                    {browserNotify.permission === "unsupported"
                      ? "Your browser does not support native notifications."
                      : browserNotify.permission === "granted"
                        ? "Enabled — new alerts will pop out of the browser."
                        : browserNotify.permission === "denied"
                          ? "Denied — adjust in your browser settings to re-enable."
                          : "Allow native popups when something needs your attention."}
                  </p>
                </div>
                {browserNotify.permission === "default" && (
                  <button
                    type="button"
                    onClick={() => browserNotify.request()}
                    className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-hover"
                  >
                    Allow
                  </button>
                )}
                {browserNotify.permission === "granted" && (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    On
                  </span>
                )}
                {browserNotify.permission === "denied" && (
                  <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                    Blocked
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse items-stretch justify-between gap-3 md:flex-row md:items-center">
          <button
            type="button"
            onClick={handleLogout}
            disabled={logout.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>

          <button
            type="submit"
            disabled={!isDirty || busy}
            className="inline-flex items-center justify-center rounded-xl bg-navy-950 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-navy-800 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
