import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/demo-mode";
import { incidentsRepository } from "@/lib/incidents/repository";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: { token: string } }
) {
  const chemical = await incidentsRepository.getChemicalByEmergencyToken(
    params.token
  );
  if (!chemical?.sds_file_path) {
    return NextResponse.json({ error: "SDS not available" }, { status: 404 });
  }

  if (isDemoMode()) {
    return NextResponse.json({
      url: `/api/sds/demo/${chemical.id}`,
    });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  const { data, error } = await admin.storage
    .from("sds-files")
    .createSignedUrl(chemical.sds_file_path, 3600);

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "SDS not available" }, { status: 404 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
