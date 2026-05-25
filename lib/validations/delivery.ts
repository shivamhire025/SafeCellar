import { z } from "zod";

export const deliverySchema = z.object({
  supplier: z.string().min(1, "Supplier is required"),
  order_number: z.string().optional(),
  order_date: z.string().min(1, "Order date is required"),
  expected_date: z.string().optional(),
  notes: z.string().optional(),
});

export const deliveryItemSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  barcode: z.string().optional(),
  quantity: z.coerce.number().min(1).default(1),
  unit: z.string().default("each"),
  chemical_id: z.string().optional(),
});

export type DeliveryFormValues = z.infer<typeof deliverySchema>;
export type DeliveryItemFormValues = z.infer<typeof deliveryItemSchema>;
