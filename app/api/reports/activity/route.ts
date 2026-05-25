import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-mode";
import { activityRepository } from "@/lib/activity/repository";
import { toCsv } from "@/lib/reports/csv";

export async function GET() {
  if (!isDemoMode() && !(await getSession())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const entries = await activityRepository.getActivityLogForExport(500);
  const rows: string[][] = [
    ["Date", "Actor", "Action", "Entity Type", "Entity ID"],
    ...entries.map((e) => [
      new Date(e.created_at).toISOString(),
      e.actor_name ?? "System",
      e.action,
      e.entity_type ?? "",
      e.entity_id ?? "",
    ]),
  ];

  const csv = toCsv(rows);
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="activity-log-${date}.csv"`,
    },
  });
}
