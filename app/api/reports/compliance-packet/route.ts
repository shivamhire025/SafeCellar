import { NextResponse } from "next/server";
import JSZip from "jszip";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-mode";
import { createClient } from "@/lib/supabase/server";
import { getComplianceTerminology } from "@/lib/compliance/terminology";
import { fetchHazcomPacketData } from "@/lib/reports/fetch-packet-data";
import { buildHazcomHtml } from "@/lib/reports/hazcom-packet";
import { generateHazcomPdf } from "@/lib/reports/generate-pdf";
import { buildPacketReadme } from "@/lib/reports/packet-readme";
import {
  buildActivityLogCsv,
  buildDeliveriesCsv,
  buildSdsReviewCsv,
  buildTrainingRecordsCsv,
} from "@/lib/reports/csv-builders";

export const runtime = "nodejs";

export async function GET() {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await fetchHazcomPacketData();
    if (!data) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const terms = getComplianceTerminology(data.org.regulatory_profile);
    const slug = data.org.name.replace(/\s+/g, "-").toLowerCase();
    const date = new Date().toISOString().slice(0, 10);

    const [html, pdf, activityCsv, sdsCsv, deliveriesCsv, trainingCsv] =
      await Promise.all([
        Promise.resolve(buildHazcomHtml(data)),
        generateHazcomPdf(data),
        buildActivityLogCsv(),
        buildSdsReviewCsv(),
        buildDeliveriesCsv(),
        buildTrainingRecordsCsv(),
      ]);

    const zip = new JSZip();
    zip.file(`written-program-${date}.html`, html);
    zip.file(`written-program-${date}.pdf`, pdf);
    zip.file(
      "compliance-summary.json",
      JSON.stringify(
        {
          generated_at: data.generatedAt.toISOString(),
          regulatory_profile: data.org.regulatory_profile ?? "ca",
          compliance: data.stats,
          chemicals: data.chemicals.map((c) => ({
            name: c.name,
            sds_status: c.sds_status,
            sds_file_path: c.sds_file_path,
          })),
        },
        null,
        2
      )
    );
    zip.file("exports/activity-log.csv", activityCsv);
    zip.file("exports/sds-review-queue.csv", sdsCsv);
    zip.file("exports/deliveries.csv", deliveriesCsv);
    zip.file("exports/training-records.csv", trainingCsv);
    zip.file(
      "README.txt",
      buildPacketReadme(data.org.regulatory_profile, data.stats, isDemoMode())
    );

    const compliantWithFiles = data.chemicals.filter(
      (c) => c.sds_status === "compliant" && c.sds_file_path
    );

    if (!isDemoMode()) {
      const supabase = await createClient();
      if (supabase) {
        for (const c of compliantWithFiles) {
          const path = c.sds_file_path!;
          const { data: fileData, error } = await supabase.storage
            .from("sds-files")
            .download(path);
          if (!error && fileData) {
            const buf = Buffer.from(await fileData.arrayBuffer());
            const safeName = c.name.replace(/[^a-zA-Z0-9._-]/g, "_");
            zip.file(`sds/${safeName}.pdf`, buf);
          }
        }
      }
    } else {
      zip.file(
        "sds/README-demo-mode.txt",
        "SDS PDF files are stored in Supabase when not in demo mode. Upload SDS documents for each compliant chemical."
      );
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${terms.packetFilenamePrefix}-${slug}-${date}.zip"`,
      },
    });
  } catch (err) {
    console.error("compliance-packet", err);
    return NextResponse.json(
      { error: "Could not generate compliance packet", message: String(err) },
      { status: 500 }
    );
  }
}
