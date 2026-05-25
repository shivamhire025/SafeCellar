import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "safecellar",
    demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
  });
}
