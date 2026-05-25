import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { chemicalsRepository } from "@/lib/chemicals/repository";
import { isDemoMode } from "@/lib/demo-mode";

export async function POST(request: Request) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const chemicalId = formData.get("chemicalId") as string;
  const version = formData.get("version") as string;
  const file = formData.get("file") as File | null;

  if (!chemicalId || !version) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const chemical = await chemicalsRepository.uploadSds(chemicalId, file, version);
  if (!chemical) {
    return NextResponse.json({ error: "Chemical not found" }, { status: 404 });
  }

  return NextResponse.json(chemical);
}
