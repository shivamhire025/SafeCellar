import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";

export async function POST(request: Request) {
  const formData = await request.formData();
  const chemicalId = formData.get("chemicalId") as string;
  const version = formData.get("version") as string;
  const file = formData.get("file") as File | null;

  if (!chemicalId || !version) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const filePath = file
    ? `/demo/sds/${chemicalId}-${file.name}`
    : `/demo/sds/${chemicalId}.pdf`;

  const chemical = demoStore.uploadSds(chemicalId, filePath, version);
  if (!chemical) {
    return NextResponse.json({ error: "Chemical not found" }, { status: 404 });
  }

  return NextResponse.json(chemical);
}
