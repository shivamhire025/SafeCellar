import { demoStore } from "@/lib/demo-store";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import type { Worker } from "@/types/database";

export const workersRepository = {
  async getWorkers(): Promise<Worker[]> {
    if (isDemoMode()) {
      return demoStore.getWorkers();
    }

    const supabase = await createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("workers")
      .select("*")
      .eq("is_active", true)
      .order("full_name");

    if (error || !data) return [];
    return data as Worker[];
  },
};
