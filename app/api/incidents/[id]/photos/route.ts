import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const photo = demoStore.addIncidentPhoto(params.id, {
    file_name: body.file_name ?? "photo.jpg",
    original_data_url: body.original_data_url,
    annotated_data_url: body.annotated_data_url ?? body.original_data_url,
    annotation_strokes: body.annotation_strokes ?? null,
    caption: body.caption ?? null,
  });
  if (!photo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const incident = demoStore.getIncident(params.id);
  return NextResponse.json({ photo, incident }, { status: 201 });
}
