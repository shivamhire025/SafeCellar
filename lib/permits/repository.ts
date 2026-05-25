import { demoStore } from "@/lib/demo-store";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import type { ConfinedSpacePermit } from "@/types/database";

export const permitsRepository = {
  async getPermits(): Promise<ConfinedSpacePermit[]> {
    if (isDemoMode()) return demoStore.getConfinedSpacePermits();

    const supabase = await createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("confined_space_permits")
      .select("*, equipment(name)")
      .order("entry_date", { ascending: false });

    if (error || !data) return [];

    return data.map((row) => {
      const eq = row.equipment as { name?: string } | { name?: string }[] | null;
      const equipmentName = Array.isArray(eq) ? eq[0]?.name : eq?.name;
      return {
        ...(row as ConfinedSpacePermit),
        equipment_name: equipmentName,
      };
    });
  },

  async createPermit(
    input: Omit<
      ConfinedSpacePermit,
      "id" | "organization_id" | "created_at" | "updated_at" | "equipment_name"
    >
  ): Promise<ConfinedSpacePermit | null> {
    if (isDemoMode()) return demoStore.createConfinedSpacePermit(input);

    const session = await getSession();
    const supabase = await createClient();
    if (!session || !supabase) return null;

    const { data, error } = await supabase
      .from("confined_space_permits")
      .insert({
        ...input,
        organization_id: session.organization_id,
        created_by: session.id,
      })
      .select("*, equipment(name)")
      .single();

    if (error || !data) return null;

    const eq = data.equipment as { name?: string } | null;
    return {
      ...(data as ConfinedSpacePermit),
      equipment_name: eq?.name,
    };
  },
};
