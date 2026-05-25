import { demoStore } from "@/lib/demo-store";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-mode";
import { createClient } from "@/lib/supabase/server";
import type { Delivery, DeliveryItem } from "@/types/database";

async function requireAuth() {
  const session = await getSession();
  if (!session) return null;
  const supabase = await createClient();
  if (!supabase) return null;
  return { session, supabase };
}

type DeliveryRow = Delivery & {
  delivery_items?: DeliveryItem[] | DeliveryItem | null;
};

function mapDelivery(row: DeliveryRow): Delivery {
  const itemsRaw = row.delivery_items;
  const items = Array.isArray(itemsRaw)
    ? itemsRaw
    : itemsRaw
      ? [itemsRaw]
      : [];
  return {
    id: row.id,
    organization_id: row.organization_id,
    order_number: row.order_number,
    supplier: row.supplier,
    order_date: row.order_date,
    expected_date: row.expected_date,
    delivered_date: row.delivered_date,
    status: row.status,
    notes: row.notes,
    created_by: row.created_by,
    received_by: row.received_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
    items,
  };
}

export const deliveriesRepository = {
  async getDeliveries(status?: string): Promise<Delivery[]> {
    if (isDemoMode()) {
      return demoStore.getDeliveries(status);
    }

    const ctx = await requireAuth();
    if (!ctx) return [];

    let query = ctx.supabase
      .from("deliveries")
      .select("*, delivery_items(*)")
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data.map((row) => mapDelivery(row as DeliveryRow));
  },

  async getDelivery(id: string): Promise<Delivery | undefined> {
    if (isDemoMode()) {
      return demoStore.getDelivery(id);
    }

    const ctx = await requireAuth();
    if (!ctx) return undefined;

    const { data, error } = await ctx.supabase
      .from("deliveries")
      .select("*, delivery_items(*)")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return undefined;
    return mapDelivery(data as DeliveryRow);
  },

  async createDelivery(
    data: Omit<
      Delivery,
      "id" | "organization_id" | "created_at" | "updated_at" | "status"
    >,
    items: Omit<DeliveryItem, "id" | "delivery_id" | "created_at">[]
  ): Promise<Delivery | null> {
    if (isDemoMode()) {
      return demoStore.createDelivery(data, items);
    }

    const ctx = await requireAuth();
    if (!ctx) return null;

    const { data: delivery, error } = await ctx.supabase
      .from("deliveries")
      .insert({
        organization_id: ctx.session.organization_id,
        order_number: data.order_number,
        supplier: data.supplier,
        order_date: data.order_date,
        expected_date: data.expected_date,
        delivered_date: data.delivered_date,
        notes: data.notes,
        status: "ordered",
        created_by: ctx.session.id,
      })
      .select()
      .single();

    if (error || !delivery) return null;

    if (items.length > 0) {
      await ctx.supabase.from("delivery_items").insert(
        items.map((item) => ({
          delivery_id: delivery.id,
          chemical_id: item.chemical_id,
          product_name: item.product_name,
          barcode: item.barcode,
          quantity: item.quantity,
          unit: item.unit,
          is_scanned: false,
          is_new_chemical: item.is_new_chemical ?? false,
          sds_review_needed: item.sds_review_needed ?? false,
        }))
      );
    }

    return (await this.getDelivery(delivery.id)) ?? null;
  },

  async updateDelivery(
    id: string,
    data: Partial<Delivery>
  ): Promise<Delivery | undefined> {
    if (isDemoMode()) {
      return demoStore.updateDelivery(id, data);
    }

    const ctx = await requireAuth();
    if (!ctx) return undefined;

    const { error } = await ctx.supabase
      .from("deliveries")
      .update({
        order_number: data.order_number,
        supplier: data.supplier,
        order_date: data.order_date,
        expected_date: data.expected_date,
        delivered_date: data.delivered_date,
        status: data.status,
        notes: data.notes,
        received_by: data.received_by,
      })
      .eq("id", id);

    if (error) return undefined;
    return this.getDelivery(id);
  },

  async scanDeliveryItem(
    deliveryId: string,
    itemId: string,
    barcode?: string
  ): Promise<DeliveryItem | undefined> {
    if (isDemoMode()) {
      return demoStore.scanDeliveryItem(deliveryId, itemId, barcode);
    }

    const ctx = await requireAuth();
    if (!ctx) return undefined;

    const delivery = await this.getDelivery(deliveryId);
    if (!delivery?.items) return undefined;

    const item = delivery.items.find((i) => i.id === itemId);
    if (!item) return undefined;

    let chemicalId = item.chemical_id;
    if (barcode) {
      const { data: chem } = await ctx.supabase
        .from("chemicals")
        .select("id, sds_status")
        .eq("barcode", barcode)
        .maybeSingle();
      if (chem) chemicalId = chem.id;
    }

    const { data: updated, error } = await ctx.supabase
      .from("delivery_items")
      .update({
        is_scanned: true,
        scanned_at: new Date().toISOString(),
        scanned_by: ctx.session.id,
        chemical_id: chemicalId,
        barcode: barcode ?? item.barcode,
        is_new_chemical: barcode ? !chemicalId : item.is_new_chemical,
        sds_review_needed: barcode ? !chemicalId : item.sds_review_needed,
      })
      .eq("id", itemId)
      .select()
      .single();

    if (error || !updated) return undefined;

    const refreshed = await this.getDelivery(deliveryId);
    if (refreshed?.items) {
      const scanned = refreshed.items.filter((i) => i.is_scanned).length;
      const total = refreshed.items.length;
      if (scanned === total) {
        await this.updateDelivery(deliveryId, { status: "complete" });
      } else if (refreshed.status === "delivered") {
        await this.updateDelivery(deliveryId, { status: "inventory_pending" });
      }
    }

    return updated as DeliveryItem;
  },

  countPendingDeliveries(): Promise<number> {
    return this.getDeliveries().then(
      (list) =>
        list.filter(
          (d) => d.status === "inventory_pending" || d.status === "delivered"
        ).length
    );
  },

  async getPendingDeliveryActions(): Promise<
    {
      id: string;
      type: "delivery";
      title: string;
      subtitle: string;
      href: string;
      badge: "delivery";
    }[]
  > {
    const deliveries = await this.getDeliveries();
    const actions: {
      id: string;
      type: "delivery";
      title: string;
      subtitle: string;
      href: string;
      badge: "delivery";
    }[] = [];

    deliveries
      .filter((d) => d.status === "inventory_pending")
      .forEach((d) => {
        const unscanned = (d.items ?? []).filter((i) => !i.is_scanned).length;
        actions.push({
          id: `delivery-${d.id}`,
          type: "delivery",
          title: `Delivery ${d.order_number ?? d.supplier}`,
          subtitle: `${unscanned} items pending inventory scan`,
          href: `/deliveries/${d.id}`,
          badge: "delivery",
        });
      });

    return actions;
  },
};
