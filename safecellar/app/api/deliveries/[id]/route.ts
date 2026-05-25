import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const delivery = demoStore.getDelivery(params.id);
  if (!delivery) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(delivery);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const delivery = demoStore.updateDelivery(params.id, body);
  if (!delivery) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(delivery);
}
