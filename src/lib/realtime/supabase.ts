import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;
let resolved = false;

export function isRemoteRealtimeEnabled() {
  return Boolean(url && anonKey) && typeof window !== "undefined";
}

export function getRealtimeClient(): SupabaseClient | null {
  if (resolved) return client;
  resolved = true;
  if (!isRemoteRealtimeEnabled()) return null;
  client = createClient(url as string, anonKey as string, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { params: { eventsPerSecond: 20 } },
  });
  return client;
}
