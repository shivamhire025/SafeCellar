import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { chemicalsRepository } from "@/lib/chemicals/repository";
import { isDemoMode } from "@/lib/demo-mode";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chemical = await chemicalsRepository.verifySds(params.id);
  if (!chemical) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(chemical);
}
