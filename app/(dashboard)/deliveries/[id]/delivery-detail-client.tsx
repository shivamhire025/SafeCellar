"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ScanBarcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AbbreviationText } from "@/components/shared/abbreviation-tooltip";
import { BarcodeScanner } from "@/components/chemicals/barcode-scanner";
import { formatDate } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import type { Delivery } from "@/types/database";

export function DeliveryDetailClient({ delivery }: { delivery: Delivery }) {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState(delivery.status);
  const [items, setItems] = useState(delivery.items ?? []);

  const scannedCount = items.filter((i) => i.is_scanned).length;

  async function updateStatus(newStatus: string) {
    const res = await fetch(`/api/deliveries/${delivery.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setStatus(newStatus as typeof status);
      router.refresh();
    }
  }

  async function scanItem(itemId: string, barcode?: string) {
    const res = await fetch(`/api/deliveries/${delivery.id}/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, barcode }),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems(
        items.map((i) => (i.id === itemId ? { ...i, ...updated } : i))
      );
      toast({ title: "Item scanned", variant: "success" });
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3 flex-wrap">
        {(status === "ordered" || status === "in_transit") && (
          <Button onClick={() => updateStatus("delivered")}>
            Mark as Delivered
          </Button>
        )}
        {status === "delivered" && (
          <Button onClick={() => setScanning(true)}>
            <ScanBarcode className="h-4 w-4" />
            Start Inventory Scan
          </Button>
        )}
        {(status === "delivered" || status === "inventory_pending") && (
          <Button
            variant="secondary"
            onClick={() =>
              updateStatus(
                scannedCount === items.length ? "complete" : "inventory_pending"
              )
            }
          >
            Finish Receiving ({scannedCount} of {items.length} scanned)
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                Qty
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                Scanned
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <p className="font-medium">{item.product_name}</p>
                  {item.is_new_chemical && (
                    <Badge variant="inventory_pending" className="mt-1">
                      <AbbreviationText text="New: SDS Required" />
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {item.quantity} {item.unit}
                </td>
                <td className="px-4 py-3">
                  {item.is_scanned ? (
                    <span className="flex items-center gap-1 text-brand-600 text-xs">
                      <CheckCircle2 className="h-4 w-4" />
                      {formatDate(item.scanned_at)}
                    </span>
                  ) : (
                    <span className="text-neutral-400 text-xs">Pending</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {!item.is_scanned && status === "delivered" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => scanItem(item.id, item.barcode ?? undefined)}
                    >
                      Scan
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {scanning && (
        <BarcodeScanner
          onScan={async (code) => {
            setScanning(false);
            const unscanned = items.find((i) => !i.is_scanned);
            if (unscanned) await scanItem(unscanned.id, code);
          }}
          onClose={() => setScanning(false)}
        />
      )}
    </div>
  );
}
