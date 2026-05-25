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
    score: chemicalStats.score,
    totalChemicals: chemicalStats.totalChemicals,
    compliantCount: chemicalStats.compliantCount,
    missingCount: chemicalStats.missingCount,
    reviewDueCount: chemicalStats.reviewDueCount,
    pendingDeliveries: chemicalStats.pendingDeliveries ?? 0,
    reviewQueueCount: chemicalStats.reviewQueueCount,
    needsAttention: chemicalStats.needsAttention,
  });
}
