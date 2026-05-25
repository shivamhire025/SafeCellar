import { NextResponse } from "next/server";
import { incidentsRepository } from "@/lib/incidents/repository";

export async function GET(
  _request: Request,
  { params }: { params: { token: string } }
) {
  const chemical = await incidentsRepository.getChemicalByEmergencyToken(
    params.token
  );
  if (!chemical) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: chemical.id,
    name: chemical.name,
    trade_name: chemical.trade_name,
    cas_number: chemical.cas_number,
    chemical_type: chemical.chemical_type,
    storage_location: chemical.storage_location,
    ppe_required: chemical.ppe_required,
    hazard_class: chemical.hazard_class,
    first_aid_notes: chemical.first_aid_notes,
    emergency_contact: chemical.emergency_contact,
    sds_status: chemical.sds_status,
    has_sds: Boolean(chemical.sds_file_path),
  });
}
