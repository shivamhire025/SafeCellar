import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-mode";
import { equipmentRepository } from "@/lib/equipment/repository";

export async function GET() {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await equipmentRepository.getEquipment());
}

export async function POST(request: Request) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const item = await equipmentRepository.createEquipment({
    name: body.name,
    equipment_type: body.equipment_type ?? "tank",
    location: body.location,
    is_confined_space: Boolean(body.is_confined_space),
    linked_chemical_ids: body.linked_chemical_ids ?? null,
    notes: body.notes,
  });

  if (!item) {
    return NextResponse.json({ error: "Failed to create" }, { status: 400 });
  }
  return NextResponse.json(item, { status: 201 });
}
