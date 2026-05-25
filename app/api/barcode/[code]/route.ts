import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { chemicalsRepository } from "@/lib/chemicals/repository";
import { isDemoMode } from "@/lib/demo-mode";

export async function GET(
  _request: Request,
  { params }: { params: { code: string } }
) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chemical = await chemicalsRepository.getChemicalByBarcode(params.code);
  return NextResponse.json({
    found: !!chemical,
    chemical: chemical ?? undefined,
  });
}
