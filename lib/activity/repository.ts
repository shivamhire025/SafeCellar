import { demoStore } from "@/lib/demo-store";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import type { ActivityLogEntry } from "@/types/database";

export const activityRepository = {
  async getActivityLog(limit = 10): Promise<ActivityLogEntry[]> {
    if (isDemoMode()) {
      return demoStore.getActivityLog(limit);
    }

    const supabase = await createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("activity_log")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data.map((row) => {
      const profile = row.profiles as { full_name?: string } | { full_name?: string }[] | null;
      const name = Array.isArray(profile)
        ? profile[0]?.full_name
        : profile?.full_name;
      const { profiles: _p, ...entry } = row as Record<string, unknown>;
      return {
        ...(entry as ActivityLogEntry),
        actor_name: name ?? undefined,
      };
    });
  },
};
