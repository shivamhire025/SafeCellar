import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-mode";
import { permitsRepository } from "@/lib/permits/repository";

export async function GET() {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await permitsRepository.getPermits());
}

export async function POST(request: Request) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const permit = await permitsRepository.createPermit({
    equipment_id: body.equipment_id ?? null,
    permit_number: body.permit_number,
    entry_date: body.entry_date,
    entrant_names: body.entrant_names ?? [],
    attendant_name: body.attendant_name,
    supervisor_name: body.supervisor_name,
    atmospheric_results: body.atmospheric_results,
    hazards_identified: body.hazards_identified ?? [],
    rescue_plan: body.rescue_plan,
    status: body.status ?? "active",
    notes: body.notes,
  });

  if (!permit) {
    return NextResponse.json({ error: "Failed to create" }, { status: 400 });
  }
  return NextResponse.json(permit, { status: 201 });
}
