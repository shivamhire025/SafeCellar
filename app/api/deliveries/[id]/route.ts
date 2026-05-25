import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deliveriesRepository } from "@/lib/deliveries/repository";
import { isDemoMode } from "@/lib/demo-mode";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const delivery = await deliveriesRepository.getDelivery(params.id);
  if (!delivery) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(delivery);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const delivery = await deliveriesRepository.updateDelivery(params.id, body);
  if (!delivery) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(delivery);
}
