import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  if (body.status !== "open" && body.status !== "resolved") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const ticket = demoStore.updateBugReportStatus(params.id, body.status);
  if (!ticket) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(ticket);
}
