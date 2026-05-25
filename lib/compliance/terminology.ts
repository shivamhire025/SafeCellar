import type { RegulatoryProfile } from "@/types/database";

export type ComplianceTerminology = {
  programTitle: string;
  programShort: string;
  readinessLabel: string;
  packetTitle: string;
  packetFilenamePrefix: string;
  pdfDocumentTitle: string;
  inspectionContext: string;
  programFormDescription: string;
  saveSuccessTitle: string;
  disclaimer: string;
  trainingStatuteHint: string;
  packetReadmeIntro: string;
};

const US: ComplianceTerminology = {
  programTitle: "Hazard Communication Program",
  programShort: "HazCom program",
  readinessLabel: "OSHA HazCom readiness",
  packetTitle: "Compliance Packet",
  packetFilenamePrefix: "compliance-packet",
  pdfDocumentTitle: "Hazard Communication Program",
  inspectionContext: "OSHA inspection or audit",
  programFormDescription:
    "These sections appear in your compliance packet export. Leave blank to use standard templates.",
  saveSuccessTitle: "HazCom program saved",
  disclaimer:
    "SafeCellar assists with compliance documentation. Your facility remains responsible for workplace safety and OSHA compliance.",
  trainingStatuteHint:
    "OSHA 29 CFR 1910.1200(h) requires training records for hazardous chemicals.",
  packetReadmeIntro:
    "This packet supports U.S. OSHA Hazard Communication (29 CFR 1910.1200) documentation.",
};

const CA: ComplianceTerminology = {
  programTitle: "WHMIS Program",
  programShort: "WHMIS program",
  readinessLabel: "WHMIS readiness",
  packetTitle: "Compliance Packet",
  packetFilenamePrefix: "compliance-packet",
  pdfDocumentTitle: "WHMIS Program",
  inspectionContext: "provincial OHS inspection or audit",
  programFormDescription:
    "These sections appear in your compliance packet export. Leave blank to use standard templates.",
  saveSuccessTitle: "WHMIS program saved",
  disclaimer:
    "SafeCellar assists with compliance documentation. Your facility remains responsible for workplace safety and applicable WHMIS and provincial OHS requirements.",
  trainingStatuteHint:
    "WHMIS requires worker education and site-specific training; keep records for each worker.",
  packetReadmeIntro:
    "This packet supports Canadian WHMIS 2015 workplace documentation. Confirm provincial OHS requirements for your jurisdiction.",
};

const BOTH: ComplianceTerminology = {
  programTitle: "Hazard Communication / WHMIS Program",
  programShort: "written program",
  readinessLabel: "Chemical safety compliance readiness",
  packetTitle: "Compliance Packet",
  packetFilenamePrefix: "compliance-packet",
  pdfDocumentTitle: "Hazard Communication / WHMIS Program",
  inspectionContext: "OSHA, provincial OHS, or internal audit",
  programFormDescription:
    "These sections appear in your compliance packet export for U.S. and Canadian frameworks. Leave blank to use standard templates.",
  saveSuccessTitle: "Written program saved",
  disclaimer:
    "SafeCellar assists with compliance documentation. Your facility remains responsible for applicable U.S. OSHA, Canadian WHMIS, and provincial OHS requirements.",
  trainingStatuteHint:
    "Document hazardous-chemical training for workers (OSHA HazCom and/or WHMIS as applicable).",
  packetReadmeIntro:
    "This packet documents chemical safety practices aligned with U.S. OSHA Hazard Communication (29 CFR 1910.1200) and Canadian WHMIS 2015. Use the sections relevant to your operating jurisdictions.",
};

export function getComplianceTerminology(
  profile: RegulatoryProfile | null | undefined
): ComplianceTerminology {
  if (profile === "us") return US;
  if (profile === "both") return BOTH;
  return CA;
}
