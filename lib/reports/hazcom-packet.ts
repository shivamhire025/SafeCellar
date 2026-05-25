import type { Chemical, ComplianceStats, Organization, TrainingRecord } from "@/types/database";
import {
  DEFAULT_HAZCOM_LABELING,
  DEFAULT_HAZCOM_MULTI_EMPLOYER,
  DEFAULT_HAZCOM_NON_ROUTINE,
  DEFAULT_HAZCOM_TRAINING,
} from "@/lib/hazcom/defaults";

export type HazcomOrgFields = Pick<
  Organization,
  | "name"
  | "address"
  | "city"
  | "state"
  | "zip"
  | "facility_type"
  | "hazcom_responsible_person"
  | "hazcom_labeling_policy"
  | "hazcom_non_routine_tasks"
  | "hazcom_multi_employer"
  | "hazcom_training_approach"
  | "sds_access_method"
>;

export type HazcomPacketData = {
  org: HazcomOrgFields;
  chemicals: Chemical[];
  stats: ComplianceStats;
  trainingRecords: TrainingRecord[];
  generatedAt: Date;
};

export function formatChemicalType(type: string): string {
  const map: Record<string, string> = {
    standard: "Standard",
    cip: "CIP Chemical",
    gas_hazard: "Confined Space Gas Hazard",
    refrigerant: "Refrigerant / Process Safety",
  };
  return map[type] ?? type;
}

export function formatSdsAccess(method?: string | null): string {
  const map: Record<string, string> = {
    digital: "Digital access via SafeCellar (authorized users and emergency QR cards)",
    binder: "Printed SDS binder maintained on site",
    both: "Digital access via SafeCellar plus printed SDS binder backup",
  };
  return map[method ?? "digital"] ?? method ?? "Digital access via SafeCellar";
}

export function buildComplianceSummary(stats: ComplianceStats): {
  status: "ready" | "attention" | "not_ready";
  message: string;
} {
  const hasGaps =
    stats.missingCount > 0 ||
    stats.reviewDueCount > 0 ||
    stats.score < 85;

  if (stats.totalChemicals === 0) {
    return {
      status: "not_ready",
      message:
        "No chemicals in inventory. Add chemicals and upload SDS documents before an inspection.",
    };
  }

  if (stats.missingCount > 0) {
    return {
      status: "not_ready",
      message: `${stats.missingCount} chemical(s) missing SDS. Resolve before presenting this packet as complete.`,
    };
  }

  if (stats.reviewDueCount > 0 || stats.score < 85) {
    return {
      status: "attention",
      message: `${stats.reviewDueCount} chemical(s) due for SDS review. Compliance score: ${stats.score}%.`,
    };
  }

  return {
    status: "ready",
    message: `All ${stats.compliantCount} chemicals have current SDS on file. Compliance score: ${stats.score}%.`,
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(d?: string | null): string {
  if (!d) return "N/A";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function buildHazcomHtml(data: HazcomPacketData): string {
  const { org, chemicals, stats, trainingRecords, generatedAt } = data;
  const summary = buildComplianceSummary(stats);
  const address = [org.address, org.city, org.state, org.zip]
    .filter(Boolean)
    .join(", ");

  const responsible =
    org.hazcom_responsible_person?.trim() || "Facility Administrator (see Settings)";
  const labeling = org.hazcom_labeling_policy?.trim() || DEFAULT_HAZCOM_LABELING;
  const nonRoutine = org.hazcom_non_routine_tasks?.trim() || DEFAULT_HAZCOM_NON_ROUTINE;
  const multiEmployer =
    org.hazcom_multi_employer?.trim() || DEFAULT_HAZCOM_MULTI_EMPLOYER;
  const trainingApproach =
    org.hazcom_training_approach?.trim() || DEFAULT_HAZCOM_TRAINING;

  const summaryClass =
    summary.status === "ready"
      ? "summary-ready"
      : summary.status === "attention"
        ? "summary-attention"
        : "summary-not-ready";

  const rows = chemicals
    .map((c) => {
      const ppe = (c.ppe_required ?? []).join(", ") || "N/A";
      const hazards = (c.hazard_class ?? []).join(", ") || "N/A";
      return `<tr class="${c.sds_status}">
        <td>${escapeHtml(c.name)}</td>
        <td>${escapeHtml(formatChemicalType(c.chemical_type))}</td>
        <td>${escapeHtml(c.manufacturer ?? "N/A")}</td>
        <td>${escapeHtml(c.cas_number ?? "N/A")}</td>
        <td>${escapeHtml(c.storage_location ?? "N/A")}</td>
        <td>${c.sds_status}</td>
        <td>${escapeHtml(c.sds_version ?? "N/A")}</td>
        <td>${formatDate(c.sds_last_verified)}</td>
        <td>${escapeHtml(hazards)}</td>
        <td>${escapeHtml(ppe)}</td>
      </tr>`;
    })
    .join("");

  const trainingRows =
    trainingRecords.length > 0
      ? trainingRecords
          .map(
            (t) => `<tr>
        <td>${escapeHtml(t.worker_name ?? "N/A")}</td>
        <td>${escapeHtml(t.training_type.replace(/_/g, " "))}</td>
        <td>${formatDate(t.completed_at)}</td>
        <td>${escapeHtml(t.trainer ?? "N/A")}</td>
        <td>${escapeHtml(t.chemical_name ?? "N/A")}</td>
      </tr>`
          )
          .join("")
      : `<tr><td colspan="5" class="empty">No training records logged yet. Add records under Workers.</td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Hazard Communication Program - ${escapeHtml(org.name)}</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; margin: 40px; color: #111827; font-size: 13px; line-height: 1.5; }
    h1 { color: #1D4ED8; font-size: 22px; margin-bottom: 4px; }
    h2 { font-size: 16px; margin-top: 28px; margin-bottom: 8px; color: #1D4ED8; border-bottom: 1px solid #E5E7EB; padding-bottom: 4px; }
    .subtitle { color: #6B7280; font-size: 14px; margin-bottom: 20px; }
    .summary { padding: 12px 16px; border-radius: 8px; margin-bottom: 24px; font-weight: 500; }
    .summary-ready { background: #F0FDF4; border: 1px solid #86EFAC; color: #166534; }
    .summary-attention { background: #FFFBEB; border: 1px solid #FCD34D; color: #92400E; }
    .summary-not-ready { background: #FEF2F2; border: 1px solid #FECACA; color: #991B1B; }
    .section p { margin: 8px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
    th { background: #F3F4F6; text-align: left; padding: 8px; border-bottom: 2px solid #E5E7EB; }
    td { padding: 8px; border-bottom: 1px solid #E5E7EB; vertical-align: top; }
    .compliant { background: #F0FDF4; }
    .missing, .outdated { background: #FEF2F2; }
    .review_due { background: #FFFBEB; }
    .empty { color: #6B7280; font-style: italic; }
    .disclaimer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #E5E7EB; font-size: 11px; color: #6B7280; }
    footer { margin-top: 16px; font-size: 12px; color: #9CA3AF; }
    @media print { body { margin: 24px; } }
  </style>
</head>
<body>
  <h1>Hazard Communication Program</h1>
  <p class="subtitle"><strong>${escapeHtml(org.name)}</strong> · ${escapeHtml(address)} · ${escapeHtml(org.facility_type)} · Generated ${generatedAt.toLocaleDateString()}</p>

  <div class="summary ${summaryClass}">${escapeHtml(summary.message)}</div>

  <h2>1. Program Administration</h2>
  <div class="section">
    <p><strong>Responsible person:</strong> ${escapeHtml(responsible)}</p>
    <p><strong>Facility:</strong> ${escapeHtml(org.name)}</p>
    <p><strong>Compliance score:</strong> ${stats.score}% (${stats.compliantCount} of ${stats.totalChemicals} chemicals compliant)</p>
  </div>

  <h2>2. Chemical Inventory and SDS Management</h2>
  <div class="section">
    <p>This facility maintains an inventory of all hazardous chemicals on site. Safety Data Sheets (SDS) are obtained before use, reviewed annually, and updated when products or suppliers change. SDS documents are stored in SafeCellar and ${escapeHtml(formatSdsAccess(org.sds_access_method))}.</p>
  </div>

  <h2>3. Labels and Warnings</h2>
  <div class="section"><p>${escapeHtml(labeling)}</p></div>

  <h2>4. Non-Routine Tasks</h2>
  <div class="section"><p>${escapeHtml(nonRoutine)}</p></div>

  <h2>5. Multi-Employer Workplaces</h2>
  <div class="section"><p>${escapeHtml(multiEmployer)}</p></div>

  <h2>6. Employee Training</h2>
  <div class="section"><p>${escapeHtml(trainingApproach)}</p></div>

  <h2>Appendix A: Chemical Inventory</h2>
  <table>
    <thead>
      <tr>
        <th>Chemical</th><th>Type</th><th>Manufacturer</th><th>CAS</th><th>Location</th>
        <th>SDS Status</th><th>SDS Version</th><th>Last Verified</th><th>Hazards</th><th>PPE</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <h2>Appendix B: Training Records</h2>
  <table>
    <thead>
      <tr><th>Worker</th><th>Training</th><th>Completed</th><th>Trainer</th><th>Chemical</th></tr>
    </thead>
    <tbody>${trainingRows}</tbody>
  </table>

  <div class="disclaimer">
    SafeCellar assists with compliance documentation. The employer remains responsible for workplace safety and OSHA compliance. This packet reflects data in SafeCellar at generation time; verify SDS files match products in use before an inspection.
  </div>
  <footer>Generated by SafeCellar · ${generatedAt.toLocaleString()}</footer>
</body>
</html>`;
}
