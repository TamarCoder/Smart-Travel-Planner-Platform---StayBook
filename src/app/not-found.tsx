import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600">
          <Compass className="h-6 w-6" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">404</p>
        <h1
          className="text-3xl font-bold text-text-primary md:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Lost in the wilderness
        </h1>
        <p className="text-sm text-text-secondary">
          The page you&rsquo;re looking for has wandered off. Let&rsquo;s get you back to the path.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/"
            className="rounded-xl bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Back home
          </Link>
          <Link
            href="/explore"
            className="rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-hover"
          >
            Explore destinations
          </Link>
        </div>
      </div>
    </main>
  );
}
