import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const deliveries = demoStore.getDeliveries(status);
  return NextResponse.json(deliveries);
}

export async function POST(request: Request) {
  const body = await request.json();
  const delivery = demoStore.createDelivery(
    {
      order_number: body.order_number,
      supplier: body.supplier,
      order_date: body.order_date,
      expected_date: body.expected_date,
      notes: body.notes,
    },
    body.items ?? []
  );
  return NextResponse.json(delivery, { status: 201 });
}
