import { demoStore } from "@/lib/demo-store";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import { deriveIncidentStatus } from "@/lib/incident-status";
import type {
  Incident,
  IncidentPhoto,
  IncidentType,
} from "@/types/database";

export type CreateIncidentInput = {
  incident_type: IncidentType;
  occurred_at: string;
  location: string;
  description: string;
  notes?: string | null;
  chemical_exposure: boolean;
  chemical_ids?: string[] | null;
  exposure_details?: string | null;
  conditions?: string | null;
  osha_recordable?: boolean;
  photos?: IncidentPhoto[];
};

export const incidentsRepository = {
  async getIncidents(filters?: {
    incident_type?: IncidentType;
    status?: Incident["status"];
  }): Promise<Incident[]> {
    if (isDemoMode()) {
      return demoStore.getIncidents(filters);
    }

    const session = await getSession();
    const supabase = await createClient();
    if (!session || !supabase) return [];

    let query = supabase
      .from("incidents")
      .select("*, incident_photos(*)")
      .order("occurred_at", { ascending: false });

    if (filters?.incident_type) {
      query = query.eq("incident_type", filters.incident_type);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    let list = data.map((row) => mapIncident(row));
    if (filters?.status) {
      list = list.filter((i) => i.status === filters.status);
    }
    return list;
  },

  async getIncident(id: string): Promise<Incident | undefined> {
    if (isDemoMode()) {
      return demoStore.getIncident(id);
    }

    const session = await getSession();
    const supabase = await createClient();
    if (!session || !supabase) return undefined;

    const { data, error } = await supabase
      .from("incidents")
      .select("*, incident_photos(*)")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return undefined;
    return mapIncident(data);
  },

  async createIncident(input: CreateIncidentInput): Promise<Incident | null> {
    if (isDemoMode()) {
      return demoStore.createIncident(input);
    }

    const session = await getSession();
    const supabase = await createClient();
    if (!session || !supabase) return null;

    const photos = input.photos ?? [];
    const status = deriveIncidentStatus(photos);

    const { data: incident, error } = await supabase
      .from("incidents")
      .insert({
        organization_id: session.organization_id,
        incident_type: input.incident_type,
        status,
        occurred_at: input.occurred_at,
        location: input.location,
        description: input.description,
        notes: input.notes ?? null,
        chemical_exposure: input.chemical_exposure,
        chemical_ids: input.chemical_ids ?? null,
        exposure_details: input.exposure_details ?? null,
        conditions: input.conditions ?? null,
        osha_recordable: input.osha_recordable ?? false,
        reported_by_id: session.id,
        reported_by_name: session.full_name,
      })
      .select("*")
      .single();

    if (error || !incident) return null;

    if (photos.length > 0) {
      await supabase.from("incident_photos").insert(
        photos.map((p) => ({
          incident_id: incident.id,
          file_name: p.file_name,
          original_data_url: p.original_data_url,
          annotation_strokes: p.annotation_strokes,
          annotated_data_url: p.annotated_data_url,
          caption: p.caption,
          uploaded_at: p.uploaded_at,
        }))
      );
    }

    await supabase.from("activity_log").insert({
      organization_id: session.organization_id,
      actor_id: session.id,
      action: `logged ${input.incident_type.replace("_", " ")} incident at ${input.location}`,
      entity_type: "incident",
      entity_id: incident.id,
    });

    return (await this.getIncident(incident.id)) ?? null;
  },

  async updateIncident(
    id: string,
    patch: Partial<
      Pick<
        Incident,
        | "description"
        | "notes"
        | "location"
        | "conditions"
        | "exposure_details"
        | "osha_recordable"
      >
    > & { photos?: IncidentPhoto[] }
  ): Promise<Incident | undefined> {
    if (isDemoMode()) {
      return demoStore.updateIncident(id, patch);
    }

    const session = await getSession();
    const supabase = await createClient();
    if (!session || !supabase) return undefined;

    const photos = patch.photos;
    const status = photos ? deriveIncidentStatus(photos) : undefined;

    const { error } = await supabase
      .from("incidents")
      .update({
        description: patch.description,
        notes: patch.notes,
        location: patch.location,
        conditions: patch.conditions,
        exposure_details: patch.exposure_details,
        ...(status ? { status } : {}),
      })
      .eq("id", id);

    if (error) return undefined;
    return this.getIncident(id);
  },

  async getChemicalByEmergencyToken(token: string): Promise<import("@/types/database").Chemical | undefined> {
    if (isDemoMode()) {
      return demoStore.getChemicalByEmergencyToken(token);
    }

    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();
    if (!admin) return undefined;

    const { data, error } = await admin
      .from("chemicals")
      .select("*")
      .eq("emergency_public_token", token)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) return undefined;
    return data as import("@/types/database").Chemical;
  },
};

function mapIncident(row: Record<string, unknown>): Incident {
  const photosRaw = row.incident_photos as Record<string, unknown>[] | null;
  const photos: IncidentPhoto[] = (photosRaw ?? []).map((p) => ({
    id: p.id as string,
    file_name: p.file_name as string,
    original_data_url: p.original_data_url as string,
    annotation_strokes: p.annotation_strokes as IncidentPhoto["annotation_strokes"],
    annotated_data_url: p.annotated_data_url as string | null | undefined,
    caption: p.caption as string | null | undefined,
    uploaded_at: p.uploaded_at as string,
  }));

  const incident: Incident = {
    id: row.id as string,
    organization_id: row.organization_id as string,
    incident_type: row.incident_type as Incident["incident_type"],
    status: deriveIncidentStatus(photos),
    occurred_at: row.occurred_at as string,
    location: row.location as string,
    description: row.description as string,
    notes: row.notes as string | null | undefined,
    chemical_exposure: row.chemical_exposure as boolean,
    chemical_ids: row.chemical_ids as string[] | null | undefined,
    exposure_details: row.exposure_details as string | null | undefined,
    conditions: row.conditions as string | null | undefined,
    photos,
    reported_by_id: row.reported_by_id as string | null | undefined,
    reported_by_name: row.reported_by_name as string | null | undefined,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };

  return incident;
}
