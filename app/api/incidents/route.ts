import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";
import type { IncidentType } from "@/types/database";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const incident_type = searchParams.get("type") as IncidentType | null;
  const status = searchParams.get("status") as
    | "complete"
    | "incomplete"
    | null;
  const incidents = demoStore.getIncidents({
    incident_type: incident_type ?? undefined,
    status: status ?? undefined,
  });
  return NextResponse.json(incidents);
}

export async function POST(request: Request) {
  const body = await request.json();
  const incident = demoStore.createIncident({
    incident_type: body.incident_type,
    occurred_at: body.occurred_at,
    location: body.location,
    description: body.description,
    notes: body.notes,
    chemical_exposure: Boolean(body.chemical_exposure),
    chemical_ids: body.chemical_ids,
    exposure_details: body.exposure_details,
    conditions: body.conditions,
    photos: body.photos ?? [],
  });
  return NextResponse.json(incident, { status: 201 });
}
