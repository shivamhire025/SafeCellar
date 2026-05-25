import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deliveriesRepository } from "@/lib/deliveries/repository";
import { isDemoMode } from "@/lib/demo-mode";

export async function GET(request: Request) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const deliveries = await deliveriesRepository.getDeliveries(status);
  return NextResponse.json(deliveries);
}

export async function POST(request: Request) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const delivery = await deliveriesRepository.createDelivery(
    {
      order_number: body.order_number,
      supplier: body.supplier,
      order_date: body.order_date,
      expected_date: body.expected_date,
      delivered_date: body.delivered_date,
      notes: body.notes,
      created_by: body.created_by,
      received_by: body.received_by,
    },
    body.items ?? []
  );

  if (!delivery) {
    return NextResponse.json({ error: "Could not create delivery" }, { status: 400 });
  }
  return NextResponse.json(delivery, { status: 201 });
}
