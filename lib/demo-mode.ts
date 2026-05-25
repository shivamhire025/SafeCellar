import { isSupabaseConfigured } from "@/lib/supabase/env";

/** Lightweight check for demo mode (safe to import from Edge middleware). */
export function isDemoMode(): boolean {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "false") return false;
  return (
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !isSupabaseConfigured()
  );
}
