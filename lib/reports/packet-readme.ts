import { getComplianceTerminology } from "@/lib/compliance/terminology";
import type { RegulatoryProfile } from "@/types/database";
import type { ComplianceStats } from "@/types/database";

export function buildPacketReadme(
  profile: RegulatoryProfile | null | undefined,
  stats: ComplianceStats,
  isDemo: boolean
): string {
  const terms = getComplianceTerminology(profile);
  const lines = [
    "SafeCellar Compliance Packet",
    `Generated: ${new Date().toISOString()}`,
    "",
    terms.packetReadmeIntro,
    "",
    "Contents:",
    "- written-program.pdf — Written program with chemical inventory and training appendix",
    "- written-program.html — Same content for browser review",
    "- compliance-summary.json — Compliance score and SDS status snapshot",
    "- exports/activity-log.csv — Facility activity audit trail",
    "- exports/sds-review-queue.csv — SDS review queue",
    "- exports/deliveries.csv — Delivery receiving records",
    "- exports/training-records.csv — Worker hazardous-chemical training log",
    "- sds/ — SDS PDF files for compliant chemicals with uploads on file",
    "",
    `Readiness: ${stats.score}% (${stats.compliantCount}/${stats.totalChemicals} chemicals compliant)`,
    `Missing SDS: ${stats.missingCount} · Review due: ${stats.reviewDueCount}`,
    "",
    "This packet is for inspection or audit preparation — not government filing.",
    terms.disclaimer,
  ];
  if (isDemo) {
    lines.push(
      "",
      "Demo mode: SDS files are stored in Supabase when not in demo mode. Upload SDS for each compliant chemical."
    );
  }
  return lines.join("\n");
}
