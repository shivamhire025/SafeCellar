import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";

export async function GET(
  _request: Request,
  { params }: { params: { code: string } }
) {
  const chemical = demoStore.getChemicalByBarcode(params.code);
  return NextResponse.json({
    found: !!chemical,
    chemical: chemical ?? undefined,
  });
}
