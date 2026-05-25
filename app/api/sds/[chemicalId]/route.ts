import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-mode";
import { chemicalsRepository } from "@/lib/chemicals/repository";

export async function GET(
  _request: Request,
  { params }: { params: { chemicalId: string } }
) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = await chemicalsRepository.getSdsSignedUrl(params.chemicalId);
  if (!url) {
    return NextResponse.json({ error: "SDS not available" }, { status: 404 });
  }

  return NextResponse.json({ url });
}
