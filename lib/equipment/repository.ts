import { demoStore } from "@/lib/demo-store";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import type { Equipment } from "@/types/database";

export const equipmentRepository = {
  async getEquipment(): Promise<Equipment[]> {
    if (isDemoMode()) return demoStore.getEquipment();

    const supabase = await createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("equipment")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error || !data) return [];
    return data as Equipment[];
  },

  async getEquipmentItem(id: string): Promise<Equipment | undefined> {
    if (isDemoMode()) return demoStore.getEquipmentItem(id);

    const supabase = await createClient();
    if (!supabase) return undefined;

    const { data, error } = await supabase
      .from("equipment")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return undefined;
    return data as Equipment;
  },

  async createEquipment(
    input: Omit<Equipment, "id" | "organization_id" | "created_at" | "updated_at" | "is_active">
  ): Promise<Equipment | null> {
    if (isDemoMode()) return demoStore.createEquipment(input);

    const session = await getSession();
    const supabase = await createClient();
    if (!session || !supabase) return null;

    const { data, error } = await supabase
      .from("equipment")
      .insert({ ...input, organization_id: session.organization_id })
      .select()
      .single();

    if (error || !data) return null;
    return data as Equipment;
  },
};
