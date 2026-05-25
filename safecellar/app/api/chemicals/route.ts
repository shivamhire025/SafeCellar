import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sds_status = searchParams.get("sds_status") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const chemicals = demoStore.getChemicals({ sds_status, search });
  return NextResponse.json(chemicals);
}

export async function POST(request: Request) {
  const body = await request.json();
  const chemical = demoStore.createChemical({
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
  return NextResponse.json(chemical, { status: 201 });
}
