import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-mode";
import { chemicalsRepository } from "@/lib/chemicals/repository";
import { toCsv } from "@/lib/reports/csv";

export async function GET() {
  if (!isDemoMode() && !(await getSession())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const items = await chemicalsRepository.getSdsReviewQueue("all", {
    includeResolved: true,
  });
  const rows: string[][] = [
    ["Chemical", "Reason", "Status", "Flagged", "Resolved"],
    ...items.map((i) => [
      i.chemical?.name ?? "Unknown",
      i.reason,
      i.status,
      i.flagged_at,
      i.resolved_at ?? "",
    ]),
  ];

  const csv = toCsv(rows);
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sds-review-queue-${date}.csv"`,
    },
  });
}
