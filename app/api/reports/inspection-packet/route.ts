import { NextResponse } from "next/server";
import JSZip from "jszip";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-mode";
import { createClient } from "@/lib/supabase/server";
import { fetchHazcomPacketData } from "@/lib/reports/fetch-packet-data";
import { buildHazcomHtml } from "@/lib/reports/hazcom-packet";
import { generateHazcomPdf } from "@/lib/reports/generate-pdf";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isDemoMode() && !(await getSession())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await fetchHazcomPacketData();
  if (!data) {
    return new NextResponse("Organization not found", { status: 404 });
  }

  const slug = data.org.name.replace(/\s+/g, "-").toLowerCase();
  const date = new Date().toISOString().slice(0, 10);
  const html = buildHazcomHtml(data);
  const pdf = await generateHazcomPdf(data);

  const zip = new JSZip();
  zip.file(`hazcom-program-${date}.html`, html);
  zip.file(`hazcom-program-${date}.pdf`, pdf);
  zip.file(
    "compliance-summary.json",
    JSON.stringify(
      {
        generated_at: data.generatedAt.toISOString(),
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
      "Content-Disposition": `attachment; filename="inspection-packet-${slug}-${date}.zip"`,
    },
  });
}
