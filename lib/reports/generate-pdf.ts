import PDFDocument from "pdfkit";
import type { HazcomPacketData } from "@/lib/reports/hazcom-packet";
import {
  buildComplianceSummary,
  formatChemicalType,
  formatSdsAccess,
} from "@/lib/reports/hazcom-packet";
import {
  DEFAULT_HAZCOM_LABELING,
  DEFAULT_HAZCOM_MULTI_EMPLOYER,
  DEFAULT_HAZCOM_NON_ROUTINE,
  DEFAULT_HAZCOM_TRAINING,
} from "@/lib/hazcom/defaults";

function formatDate(d?: string | null): string {
  if (!d) return "N/A";
  return new Date(d).toLocaleDateString("en-US");
}

export function generateHazcomPdf(data: HazcomPacketData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "LETTER" });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const { org, chemicals, stats, trainingRecords, generatedAt } = data;
    const summary = buildComplianceSummary(stats);
    const address = [org.address, org.city, org.state, org.zip]
      .filter(Boolean)
      .join(", ");

    doc
      .fontSize(18)
      .fillColor("#1D4ED8")
      .text("Hazard Communication Program", { align: "left" });
    doc
      .fontSize(10)
      .fillColor("#6B7280")
      .text(
        `${org.name} · ${address} · Generated ${generatedAt.toLocaleDateString()}`,
        { lineGap: 4 }
      );

    doc.moveDown();
    doc.fontSize(11).fillColor("#111827").text(summary.message, {
      width: 500,
    });

    const sections: [string, string][] = [
      [
        "1. Program Administration",
        `Responsible person: ${org.hazcom_responsible_person?.trim() || "Facility Administrator"}\nCompliance score: ${stats.score}% (${stats.compliantCount}/${stats.totalChemicals} chemicals compliant)`,
      ],
      [
        "2. Chemical Inventory and SDS",
        `SDS access: ${formatSdsAccess(org.sds_access_method)}. Inventory maintained in SafeCellar with annual review.`,
      ],
      [
        "3. Labels and Warnings",
        org.hazcom_labeling_policy?.trim() || DEFAULT_HAZCOM_LABELING,
      ],
      ["4. Non-Routine Tasks", org.hazcom_non_routine_tasks?.trim() || DEFAULT_HAZCOM_NON_ROUTINE],
      [
        "5. Multi-Employer Workplaces",
        org.hazcom_multi_employer?.trim() || DEFAULT_HAZCOM_MULTI_EMPLOYER,
      ],
      [
        "6. Employee Training",
        org.hazcom_training_approach?.trim() || DEFAULT_HAZCOM_TRAINING,
      ],
    ];

    for (const [title, body] of sections) {
      doc.moveDown(0.5);
      doc.fontSize(12).fillColor("#1D4ED8").text(title);
      doc.fontSize(10).fillColor("#111827").text(body, { width: 500, lineGap: 2 });
    }

    doc.moveDown();
    doc.fontSize(12).fillColor("#1D4ED8").text("Appendix A: Chemical Inventory");

    const tableTop = doc.y + 8;
    doc.fontSize(8).fillColor("#111827");
    let y = tableTop;

    const headers = ["Chemical", "Type", "SDS", "Location", "Verified"];
    headers.forEach((h, i) => {
      doc.text(h, 50 + i * 100, y, { width: 95, continued: false });
    });
    y += 14;

    for (const c of chemicals) {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
      const cols = [
        c.name.slice(0, 28),
        formatChemicalType(c.chemical_type).slice(0, 18),
        c.sds_status,
        (c.storage_location ?? "N/A").slice(0, 20),
        formatDate(c.sds_last_verified),
      ];
      cols.forEach((text, i) => {
        doc.text(text, 50 + i * 100, y, { width: 95 });
      });
      y += 12;
    }

    doc.moveDown(2);
    if (doc.y > 650) doc.addPage();
    doc.fontSize(12).fillColor("#1D4ED8").text("Appendix B: Training Records");
    doc.fontSize(9).fillColor("#111827");
    if (trainingRecords.length === 0) {
      doc.text("No training records logged yet.");
    } else {
      for (const t of trainingRecords) {
        doc.text(
          `${t.worker_name ?? "Worker"} · ${t.training_type.replace(/_/g, " ")} · ${formatDate(t.completed_at)} · ${t.trainer ?? ""}`,
          { width: 500 }
        );
      }
    }

    doc.moveDown(2);
    doc
      .fontSize(8)
      .fillColor("#6B7280")
      .text(
        "SafeCellar assists with compliance documentation. The employer remains responsible for OSHA compliance.",
        { width: 500 }
      );

    doc.end();
  });
}
