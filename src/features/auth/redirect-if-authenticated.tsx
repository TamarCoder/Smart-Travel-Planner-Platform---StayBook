"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores";

function Inner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status !== "authenticated") return;
    const next = searchParams.get("next");
    const target = next && next.startsWith("/") ? next : "/dashboard";
    router.replace(target);
  }, [status, router, searchParams]);

  return null;
}

export function RedirectIfAuthenticated() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
