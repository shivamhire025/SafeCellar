import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { itemId, barcode } = await request.json();
  const item = demoStore.scanDeliveryItem(params.id, itemId, barcode);
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
  return NextResponse.json(item);
}
