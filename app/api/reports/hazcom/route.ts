import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-mode";
import { fetchHazcomPacketData } from "@/lib/reports/fetch-packet-data";
import { buildHazcomHtml, buildComplianceSummary } from "@/lib/reports/hazcom-packet";
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

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "html";
  const strict = searchParams.get("strict") === "true";
  const summary = buildComplianceSummary(data.stats);

  if (strict && summary.status === "not_ready") {
    return NextResponse.json(
      {
        error: "Inspection packet blocked",
        message: summary.message,
        stats: data.stats,
      },
      { status: 422 }
    );
  }

  const slug = data.org.name.replace(/\s+/g, "-").toLowerCase();
  const date = new Date().toISOString().slice(0, 10);

  if (format === "pdf") {
    try {
      const pdf = await generateHazcomPdf(data);
      return new NextResponse(new Uint8Array(pdf), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="written-program-${slug}-${date}.pdf"`,
        },
      });
    } catch (err) {
      console.error("hazcom-pdf", err);
      return NextResponse.json(
        { error: "Could not generate PDF", message: String(err) },
        { status: 500 }
      );
    }
  }

  const html = buildHazcomHtml(data);
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="written-program-${slug}-${date}.html"`,
    },
  });
}
