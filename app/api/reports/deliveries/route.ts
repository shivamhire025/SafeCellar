import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-mode";
import { deliveriesRepository } from "@/lib/deliveries/repository";
import { toCsv } from "@/lib/reports/csv";

export async function GET() {
  if (!isDemoMode() && !(await getSession())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const deliveries = await deliveriesRepository.getDeliveries();
  const rows: string[][] = [
    [
      "Order",
      "Supplier",
      "Status",
      "Delivered",
      "Items",
      "Scanned",
      "Pending SDS",
    ],
    ...deliveries.map((d) => {
      const items = d.items ?? [];
      const scanned = items.filter((i) => i.is_scanned).length;
      const pendingSds = items.filter((i) => i.sds_review_needed).length;
      return [
        d.order_number ?? "",
        d.supplier,
        d.status,
        d.delivered_date ?? "",
        String(items.length),
        String(scanned),
        String(pendingSds),
      ];
    }),
  ];

  const csv = toCsv(rows);
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="delivery-compliance-${date}.csv"`,
    },
  });
}
