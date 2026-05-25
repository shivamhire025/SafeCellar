import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/** Server-only client with service role (bypasses RLS). Never expose to the browser. */
export function createAdminClient() {
  if (!isSupabaseConfigured()) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey || serviceKey.includes("your-service-role")) return null;

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
