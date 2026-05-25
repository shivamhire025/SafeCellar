import { demoStore } from "@/lib/demo-store";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import type { Organization } from "@/types/database";

export const organizationRepository = {
  async getOrganization(): Promise<Organization | null> {
    if (isDemoMode()) {
      return demoStore.getOrganization();
    }

    const session = await getSession();
    if (!session) return null;

    const supabase = await createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", session.organization_id)
      .single();

    if (error || !data) return null;
    return data as Organization;
  },
};
