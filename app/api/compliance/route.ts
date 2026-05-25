import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";
import { chemicalsRepository } from "@/lib/chemicals/repository";
import { isDemoMode } from "@/lib/demo-mode";

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json(demoStore.getComplianceStats());
  }

  const chemicalStats = await chemicalsRepository.getComplianceStats();
  return NextResponse.json({
    ...chemicalStats,
    pendingDeliveries: 0,
  });
}
