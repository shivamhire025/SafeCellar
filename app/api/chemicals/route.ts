import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { chemicalsRepository } from "@/lib/chemicals/repository";
import { isDemoMode } from "@/lib/demo-mode";

export async function GET(request: Request) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sds_status = searchParams.get("sds_status") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const chemicals = await chemicalsRepository.getChemicals({ sds_status, search });
  return NextResponse.json(chemicals);
}

export async function POST(request: Request) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const chemical = await chemicalsRepository.createChemical({
    name: body.name,
    trade_name: body.trade_name,
    manufacturer: body.manufacturer,
    supplier: body.supplier,
    cas_number: body.cas_number,
    barcode: body.barcode,
    chemical_type: body.chemical_type,
    storage_location: body.storage_location,
    notes: body.notes,
    ppe_required: body.ppe_required,
    hazard_class: body.hazard_class,
    first_aid_notes: body.first_aid_notes,
    emergency_contact: body.emergency_contact,
  });

  if (!chemical) {
    return NextResponse.json({ error: "Could not create chemical" }, { status: 400 });
  }
  return NextResponse.json(chemical, { status: 201 });
}
