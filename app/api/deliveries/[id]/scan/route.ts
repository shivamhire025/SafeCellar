import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deliveriesRepository } from "@/lib/deliveries/repository";
import { isDemoMode } from "@/lib/demo-mode";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { itemId, barcode } = await request.json();
  const item = await deliveriesRepository.scanDeliveryItem(
    params.id,
    itemId,
    barcode
  );

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
  return NextResponse.json(item);
}
