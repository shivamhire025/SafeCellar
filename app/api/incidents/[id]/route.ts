import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-mode";
import { incidentsRepository } from "@/lib/incidents/repository";
import { demoStore } from "@/lib/demo-store";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const incident = await incidentsRepository.getIncident(params.id);
  if (!incident) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(incident);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (isDemoMode()) {
    const incident = demoStore.updateIncident(params.id, body);
    if (!incident) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(incident);
  }

  const incident = await incidentsRepository.updateIncident(params.id, body);
  if (!incident) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(incident);
}
