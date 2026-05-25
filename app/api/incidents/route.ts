import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-mode";
import { incidentsRepository } from "@/lib/incidents/repository";
import type { IncidentType } from "@/types/database";

export async function GET(request: Request) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const incident_type = searchParams.get("type") as IncidentType | null;
  const status = searchParams.get("status") as "complete" | "incomplete" | null;

  const incidents = await incidentsRepository.getIncidents({
    incident_type: incident_type ?? undefined,
    status: status ?? undefined,
  });
  return NextResponse.json(incidents);
}

export async function POST(request: Request) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const incident = await incidentsRepository.createIncident({
    incident_type: body.incident_type,
    occurred_at: body.occurred_at,
    location: body.location,
    description: body.description,
    notes: body.notes,
    chemical_exposure: Boolean(body.chemical_exposure),
    chemical_ids: body.chemical_ids,
    exposure_details: body.exposure_details,
    conditions: body.conditions,
    osha_recordable: Boolean(body.osha_recordable),
    photos: body.photos ?? [],
  });

  if (!incident) {
    return NextResponse.json({ error: "Failed to create incident" }, { status: 400 });
  }

  return NextResponse.json(incident, { status: 201 });
}
