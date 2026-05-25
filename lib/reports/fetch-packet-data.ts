import { chemicalsRepository } from "@/lib/chemicals/repository";
import { organizationRepository } from "@/lib/organization/repository";
import { trainingRepository } from "@/lib/training/repository";
import { demoStore } from "@/lib/demo-store";
import { isDemoMode } from "@/lib/demo-mode";
import type { HazcomPacketData } from "@/lib/reports/hazcom-packet";

export async function fetchHazcomPacketData(): Promise<HazcomPacketData | null> {
  const org =
    (await organizationRepository.getOrganization()) ??
    (isDemoMode() ? demoStore.getOrganization() : null);
  if (!org) return null;

  const [chemicals, stats, trainingRecords] = await Promise.all([
    chemicalsRepository.getChemicals(),
    chemicalsRepository.getComplianceStats(),
    trainingRepository.getTrainingRecords(),
  ]);

  return {
    org,
    chemicals,
    stats,
    trainingRecords,
    generatedAt: new Date(),
  };
}
