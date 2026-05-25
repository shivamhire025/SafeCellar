import { demoStore } from "@/lib/demo-store";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import type { Organization, SdsAccessMethod } from "@/types/database";

export type UpdateOrganizationInput = {
  hazcom_responsible_person?: string | null;
  hazcom_labeling_policy?: string | null;
  hazcom_non_routine_tasks?: string | null;
  hazcom_multi_employer?: string | null;
  hazcom_training_approach?: string | null;
  sds_access_method?: SdsAccessMethod | null;
};

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

  async updateOrganization(input: UpdateOrganizationInput): Promise<Organization | null> {
    if (isDemoMode()) {
      return demoStore.updateOrganization(input);
    }

    const session = await getSession();
    if (!session) return null;

    const supabase = await createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("organizations")
      .update(input)
      .eq("id", session.organization_id)
      .select("*")
      .single();

    if (error || !data) return null;
    return data as Organization;
  },
};
