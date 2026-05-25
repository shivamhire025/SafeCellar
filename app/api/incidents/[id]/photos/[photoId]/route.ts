import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; photoId: string } }
) {
  const body = await request.json();
  const photo = demoStore.updateIncidentPhoto(params.id, params.photoId, {
    annotation_strokes: body.annotation_strokes,
    annotated_data_url: body.annotated_data_url,
    caption: body.caption,
  });
  if (!photo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const incident = demoStore.getIncident(params.id);
  return NextResponse.json({ photo, incident });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; photoId: string } }
) {
  const ok = demoStore.removeIncidentPhoto(params.id, params.photoId);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const incident = demoStore.getIncident(params.id);
  return NextResponse.json({ incident });
}
