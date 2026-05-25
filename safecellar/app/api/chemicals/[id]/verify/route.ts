import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const chemical = demoStore.verifySds(params.id);
  if (!chemical) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(chemical);
}
