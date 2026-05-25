import { demoStore } from "@/lib/demo-store";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import type { TrainingRecord, TrainingType } from "@/types/database";

export type CreateTrainingInput = {
  worker_id: string;
  training_type: TrainingType;
  completed_at: string;
  trainer?: string | null;
  notes?: string | null;
  chemical_id?: string | null;
};

export const trainingRepository = {
  async getTrainingRecords(workerId?: string): Promise<TrainingRecord[]> {
    if (isDemoMode()) {
      return demoStore.getTrainingRecords(workerId);
    }

    const session = await getSession();
    const supabase = await createClient();
    if (!session || !supabase) return [];

    let query = supabase
      .from("training_records")
      .select("*, workers(full_name), chemicals(name)")
      .order("completed_at", { ascending: false });

    if (workerId) {
      query = query.eq("worker_id", workerId);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((row) => mapTrainingRow(row));
  },

  async createTrainingRecord(input: CreateTrainingInput): Promise<TrainingRecord | null> {
    if (isDemoMode()) {
      return demoStore.createTrainingRecord(input);
    }

    const session = await getSession();
    const supabase = await createClient();
    if (!session || !supabase) return null;

    const { data, error } = await supabase
      .from("training_records")
      .insert({
        organization_id: session.organization_id,
        worker_id: input.worker_id,
        training_type: input.training_type,
        completed_at: input.completed_at,
        trainer: input.trainer ?? null,
        notes: input.notes ?? null,
        chemical_id: input.chemical_id ?? null,
        created_by: session.id,
      })
      .select("*, workers(full_name), chemicals(name)")
      .single();

    if (error || !data) return null;
    return mapTrainingRow(data);
  },

  async getWorkersMissingInitialTraining(): Promise<number> {
    if (isDemoMode()) {
      return demoStore.getWorkersMissingInitialTraining();
    }

    const session = await getSession();
    const supabase = await createClient();
    if (!session || !supabase) return 0;

    const { data: workers } = await supabase
      .from("workers")
      .select("id")
      .eq("is_active", true);

    if (!workers?.length) return 0;

    const { data: trained } = await supabase
      .from("training_records")
      .select("worker_id")
      .eq("training_type", "hazcom_initial");

    const trainedIds = new Set((trained ?? []).map((t) => t.worker_id));
    return workers.filter((w) => !trainedIds.has(w.id)).length;
  },
};

function mapTrainingRow(row: Record<string, unknown>): TrainingRecord {
  const worker = row.workers as { full_name?: string } | { full_name?: string }[] | null;
  const chemical = row.chemicals as { name?: string } | { name?: string }[] | null;
  const workerName = Array.isArray(worker) ? worker[0]?.full_name : worker?.full_name;
  const chemicalName = Array.isArray(chemical) ? chemical[0]?.name : chemical?.name;

  return {
    id: row.id as string,
    organization_id: row.organization_id as string,
    worker_id: row.worker_id as string,
    training_type: row.training_type as TrainingRecord["training_type"],
    completed_at: row.completed_at as string,
    trainer: row.trainer as string | null | undefined,
    notes: row.notes as string | null | undefined,
    chemical_id: row.chemical_id as string | null | undefined,
    created_by: row.created_by as string | null | undefined,
    created_at: row.created_at as string,
    worker_name: workerName,
    chemical_name: chemicalName,
  };
}
