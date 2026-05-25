"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  deliverySchema,
  type DeliveryFormValues,
  type DeliveryItemFormValues,
} from "@/lib/validations/delivery";
import { toast } from "@/components/ui/use-toast";

export default function NewDeliveryPage() {
  const router = useRouter();
  const [items, setItems] = useState<DeliveryItemFormValues[]>([]);
  const [itemForm, setItemForm] = useState<DeliveryItemFormValues>({
    product_name: "",
    barcode: "",
    quantity: 1,
    unit: "each",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      order_date: new Date().toISOString().split("T")[0],
    },
  });

  function addItem() {
    if (!itemForm.product_name) return;
    setItems([...items, { ...itemForm }]);
    setItemForm({ product_name: "", barcode: "", quantity: 1, unit: "each" });
  }

  async function onSubmit(data: DeliveryFormValues) {
    const res = await fetch("/api/deliveries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, items }),
    });
    if (!res.ok) {
      toast({ title: "Error", description: "Failed to create delivery", variant: "destructive" });
      return;
    }
    const delivery = await res.json();
    router.push(`/deliveries/${delivery.id}`);
  }

  return (
    <>
      <Topbar title="New Delivery" userName="Marcus Chen" />
      <PageShell title="Create Delivery" description="Log a new chemical order">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-2xl space-y-6"
        >
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Supplier <span className="text-red-500">*</span></Label>
                <Input {...register("supplier")} />
                {errors.supplier && <p className="text-xs text-red-600">{errors.supplier.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Order Number</Label>
                <Input {...register("order_number")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Order Date <span className="text-red-500">*</span></Label>
                <Input type="date" {...register("order_date")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Expected Delivery</Label>
                <Input type="date" {...register("expected_date")} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Notes</Label>
              <textarea
                {...register("notes")}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md min-h-[60px]"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
            <h3 className="text-base font-semibold mb-4">Add Items</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <Input
                placeholder="Product name *"
                value={itemForm.product_name}
                onChange={(e) =>
                  setItemForm({ ...itemForm, product_name: e.target.value })
                }
              />
              <Input
                placeholder="Barcode"
                value={itemForm.barcode}
                onChange={(e) =>
                  setItemForm({ ...itemForm, barcode: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Qty"
                value={itemForm.quantity}
                onChange={(e) =>
                  setItemForm({ ...itemForm, quantity: Number(e.target.value) })
                }
              />
              <select
                className="h-9 rounded-md border border-neutral-300 px-3 text-sm"
                value={itemForm.unit}
                onChange={(e) =>
                  setItemForm({ ...itemForm, unit: e.target.value })
                }
              >
                <option value="each">each</option>
                <option value="gallon">gallon</option>
                <option value="liter">liter</option>
                <option value="kg">kg</option>
                <option value="box">box</option>
              </select>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4" /> Add Item
            </Button>
            {items.length > 0 && (
              <ul className="mt-4 divide-y divide-neutral-100">
                {items.map((item, i) => (
                  <li key={i} className="flex justify-between py-2 text-sm">
                    <span>
                      {item.product_name} × {item.quantity} {item.unit}
                    </span>
                    <button
                      type="button"
                      onClick={() => setItems(items.filter((_, j) => j !== i))}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" asChild>
              <Link href="/deliveries">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Create Delivery
            </Button>
          </div>
        </form>
      </PageShell>
    </>
  );
}
