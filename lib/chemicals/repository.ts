import { demoStore } from "@/lib/demo-store";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-mode";
import { createClient } from "@/lib/supabase/server";
import type {
  Chemical,
  ChemicalType,
  ComplianceStats,
  SdsReviewItem,
  SdsStatus,
} from "@/types/database";
import type { ChemicalImportRow } from "@/lib/validations/chemical-import";

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function filterChemicals(
  list: Chemical[],
  filters?: { sds_status?: string; search?: string }
): Chemical[] {
  let result = list.filter((c) => c.is_active);
  if (filters?.sds_status && filters.sds_status !== "all") {
    result = result.filter((c) => c.sds_status === filters.sds_status);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.trade_name?.toLowerCase().includes(q) ||
        c.manufacturer?.toLowerCase().includes(q) ||
        c.supplier?.toLowerCase().includes(q) ||
        c.cas_number?.toLowerCase().includes(q)
    );
  }
  return result;
}

async function requireAuth() {
  const session = await getSession();
  if (!session) return null;
  const supabase = await createClient();
  if (!supabase) return null;
  return { session, supabase };
}

async function appendActivity(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  organizationId: string,
  actorId: string,
  action: string,
  entityId: string
) {
  await supabase.from("activity_log").insert({
    organization_id: organizationId,
    actor_id: actorId,
    action,
    entity_type: "chemical",
    entity_id: entityId,
  });
}

export type CreateChemicalInput = {
  name: string;
  trade_name?: string | null;
  manufacturer?: string | null;
  supplier?: string | null;
  cas_number?: string | null;
  barcode?: string | null;
  chemical_type: ChemicalType;
  storage_location?: string | null;
  notes?: string | null;
  ppe_required?: string[] | null;
  hazard_class?: string[] | null;
  first_aid_notes?: string | null;
  emergency_contact?: string | null;
};

export const chemicalsRepository = {
  async getChemicals(filters?: {
    sds_status?: string;
    search?: string;
  }): Promise<Chemical[]> {
    if (isDemoMode()) {
      return demoStore.getChemicals(filters);
    }

    const ctx = await requireAuth();
    if (!ctx) return [];

    const { data, error } = await ctx.supabase
      .from("chemicals")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error || !data) return [];
    return filterChemicals(data as Chemical[], filters);
  },

  async getChemical(id: string): Promise<Chemical | undefined> {
    if (isDemoMode()) {
      return demoStore.getChemical(id);
    }

    const ctx = await requireAuth();
    if (!ctx) return undefined;

    const { data, error } = await ctx.supabase
      .from("chemicals")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return undefined;
    return data as Chemical;
  },

  async getChemicalByBarcode(barcode: string): Promise<Chemical | undefined> {
    if (isDemoMode()) {
      return demoStore.getChemicalByBarcode(barcode);
    }

    const ctx = await requireAuth();
    if (!ctx) return undefined;

    const { data, error } = await ctx.supabase
      .from("chemicals")
      .select("*")
      .eq("barcode", barcode)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) return undefined;
    return data as Chemical;
  },

  async createChemical(input: CreateChemicalInput): Promise<Chemical | null> {
    if (isDemoMode()) {
      return demoStore.createChemical({
        ...input,
        trade_name: input.trade_name ?? null,
        manufacturer: input.manufacturer ?? null,
        supplier: input.supplier ?? null,
        cas_number: input.cas_number ?? null,
        barcode: input.barcode ?? null,
        storage_location: input.storage_location ?? null,
        notes: input.notes ?? null,
        ppe_required: input.ppe_required ?? null,
        hazard_class: input.hazard_class ?? null,
        first_aid_notes: input.first_aid_notes ?? null,
        emergency_contact: input.emergency_contact ?? null,
      });
    }

    const ctx = await requireAuth();
    if (!ctx) return null;

    const { session, supabase } = ctx;
    const { data, error } = await supabase
      .from("chemicals")
      .insert({
        organization_id: session.organization_id,
        name: input.name,
        trade_name: input.trade_name ?? null,
        manufacturer: input.manufacturer ?? null,
        supplier: input.supplier ?? null,
        cas_number: input.cas_number ?? null,
        barcode: input.barcode ?? null,
        chemical_type: input.chemical_type,
        storage_location: input.storage_location ?? null,
        notes: input.notes ?? null,
        ppe_required: input.ppe_required ?? null,
        hazard_class: input.hazard_class ?? null,
        first_aid_notes: input.first_aid_notes ?? null,
        emergency_contact: input.emergency_contact ?? null,
        sds_status: "missing" as SdsStatus,
        is_active: true,
      })
      .select()
      .single();

    if (error || !data) return null;

    const chemical = data as Chemical;

    await supabase.from("sds_review_queue").insert({
      organization_id: session.organization_id,
      chemical_id: chemical.id,
      reason: "new_chemical",
      status: "pending",
    });

    await appendActivity(
      supabase,
      session.organization_id,
      session.id,
      `added new chemical ${chemical.name}`,
      chemical.id
    );

    return chemical;
  },

  async importChemicals(rows: ChemicalImportRow[]): Promise<{
    created: Chemical[];
    errors: { row: number; message: string }[];
  }> {
    if (isDemoMode()) {
      return demoStore.importChemicals(rows);
    }

    const ctx = await requireAuth();
    if (!ctx) {
      return { created: [], errors: [{ row: 0, message: "Not authenticated" }] };
    }

    const { session, supabase } = ctx;
    const inserts = rows.map((row) => ({
      organization_id: session.organization_id,
      name: row.name,
      trade_name: row.trade_name ?? null,
      manufacturer: row.manufacturer,
      supplier: row.supplier ?? null,
      cas_number: row.cas_number ?? null,
      barcode: row.barcode ?? null,
      chemical_type: row.chemical_type,
      storage_location: row.storage_location,
      notes: row.notes ?? null,
      hazard_class: row.hazard_class ?? null,
      sds_status: "missing" as SdsStatus,
      is_active: true,
    }));

    const { data, error } = await supabase
      .from("chemicals")
      .insert(inserts)
      .select();

    if (error || !data?.length) {
      return {
        created: [],
        errors: [{ row: 0, message: error?.message ?? "Import failed" }],
      };
    }

    const created = data as Chemical[];

    await supabase.from("sds_review_queue").insert(
      created.map((c) => ({
        organization_id: session.organization_id,
        chemical_id: c.id,
        reason: "new_chemical" as const,
        status: "pending" as const,
      }))
    );

    await appendActivity(
      supabase,
      session.organization_id,
      session.id,
      `bulk imported ${created.length} chemical${created.length === 1 ? "" : "s"}`,
      created[0].id
    );

    return { created, errors: [] };
  },

  async verifySds(id: string): Promise<Chemical | null> {
    if (isDemoMode()) {
      return demoStore.verifySds(id) ?? null;
    }

    const ctx = await requireAuth();
    if (!ctx) return null;

    const now = new Date().toISOString();
    const reviewDue = addMonths(new Date(), 12).toISOString();

    const { data, error } = await ctx.supabase
      .from("chemicals")
      .update({
        sds_last_verified: now,
        sds_review_due_at: reviewDue,
        sds_status: "compliant",
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return null;
    return data as Chemical;
  },

  async uploadSds(
    chemicalId: string,
    file: File | null,
    version: string
  ): Promise<Chemical | null> {
    if (isDemoMode()) {
      const filePath = file
        ? `/demo/sds/${chemicalId}-${file.name}`
        : `/demo/sds/${chemicalId}.pdf`;
      return demoStore.uploadSds(chemicalId, filePath, version) ?? null;
    }

    const ctx = await requireAuth();
    if (!ctx) return null;

    const { session, supabase } = ctx;
    const safeName = file?.name?.replace(/[^a-zA-Z0-9._-]/g, "_") ?? "sds.pdf";
    const storagePath = `${session.organization_id}/${chemicalId}/${safeName}`;

    if (file && file.size > 0) {
      const buffer = await file.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from("sds-files")
        .upload(storagePath, buffer, {
          contentType: file.type || "application/pdf",
          upsert: true,
        });
      if (uploadError) return null;
    }

    const now = new Date().toISOString();
    const reviewDue = addMonths(new Date(), 12).toISOString();

    const { data, error } = await supabase
      .from("chemicals")
      .update({
        sds_file_path: storagePath,
        sds_version: version,
        sds_uploaded_at: now,
        sds_last_verified: now,
        sds_review_due_at: reviewDue,
        sds_status: "compliant",
      })
      .eq("id", chemicalId)
      .select()
      .single();

    if (error || !data) return null;

    const chemical = data as Chemical;

    await supabase
      .from("sds_review_queue")
      .update({ status: "resolved", resolved_at: now, resolved_by: session.id })
      .eq("chemical_id", chemicalId)
      .eq("status", "pending");

    await appendActivity(
      supabase,
      session.organization_id,
      session.id,
      `uploaded SDS for ${chemical.name}`,
      chemicalId
    );

    return chemical;
  },

  async getComplianceStats(): Promise<
    Pick<
      ComplianceStats,
      | "score"
      | "totalChemicals"
      | "compliantCount"
      | "missingCount"
      | "reviewDueCount"
      | "reviewQueueCount"
      | "needsAttention"
    >
  > {
    if (isDemoMode()) {
      const s = demoStore.getComplianceStats();
      return {
        score: s.score,
        totalChemicals: s.totalChemicals,
        compliantCount: s.compliantCount,
        missingCount: s.missingCount,
        reviewDueCount: s.reviewDueCount,
        reviewQueueCount: s.reviewQueueCount,
        needsAttention: s.missingCount + s.reviewDueCount + s.reviewQueueCount,
      };
    }

    const chemicals = await this.getChemicals();
    const compliant = chemicals.filter((c) => c.sds_status === "compliant").length;
    const missing = chemicals.filter((c) => c.sds_status === "missing").length;
    const reviewDue = chemicals.filter((c) => c.sds_status === "review_due").length;
    const total = chemicals.length;
    const score = total === 0 ? 0 : Math.round((compliant / total) * 100);

    let reviewQueueCount = 0;
    const ctx = await requireAuth();
    if (ctx) {
      const { count } = await ctx.supabase
        .from("sds_review_queue")
        .select("*", { count: "exact", head: true })
        .neq("status", "resolved");
      reviewQueueCount = count ?? 0;
    }

    return {
      score,
      totalChemicals: total,
      compliantCount: compliant,
      missingCount: missing,
      reviewDueCount: reviewDue,
      reviewQueueCount,
      needsAttention: missing + reviewDue + reviewQueueCount,
    };
  },

  async getPendingChemicalActions(): Promise<
    {
      id: string;
      type: "missing_sds" | "review_due";
      title: string;
      subtitle: string;
      href: string;
      badge: "missing" | "review_due";
    }[]
  > {
    const chemicals = await this.getChemicals();
    const actions: {
      id: string;
      type: "missing_sds" | "review_due";
      title: string;
      subtitle: string;
      href: string;
      badge: "missing" | "review_due";
    }[] = [];

    chemicals
      .filter((c) => c.sds_status === "missing")
      .forEach((c) => {
        actions.push({
          id: `missing-${c.id}`,
          type: "missing_sds",
          title: c.name,
          subtitle: "SDS missing. Compliance gate active.",
          href: `/chemicals/${c.id}`,
          badge: "missing",
        });
      });

    chemicals
      .filter((c) => c.sds_status === "review_due")
      .forEach((c) => {
        actions.push({
          id: `review-${c.id}`,
          type: "review_due",
          title: c.name,
          subtitle: "Annual SDS review due",
          href: `/chemicals/${c.id}`,
          badge: "review_due",
        });
      });

    return actions;
  },

  async getSdsReviewQueue(status?: string): Promise<SdsReviewItem[]> {
    if (isDemoMode()) {
      return demoStore.getSdsReviewQueue(status);
    }

    const ctx = await requireAuth();
    if (!ctx) return [];

    let query = ctx.supabase
      .from("sds_review_queue")
      .select("*, chemicals(*)")
      .neq("status", "resolved")
      .order("flagged_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((row) => {
      const chem = row.chemicals as Chemical | Chemical[] | null;
      const chemical = Array.isArray(chem) ? chem[0] : chem;
      const { chemicals: _c, ...item } = row as Record<string, unknown>;
      return {
        ...(item as SdsReviewItem),
        chemical: chemical ?? undefined,
      };
    });
  },
};
