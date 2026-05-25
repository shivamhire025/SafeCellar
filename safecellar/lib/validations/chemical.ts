import { z } from "zod";

export const chemicalSchema = z.object({
  name: z.string().min(1, "Chemical name is required"),
  trade_name: z.string().optional(),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  supplier: z.string().optional(),
  cas_number: z.string().optional(),
  barcode: z.string().optional(),
  chemical_type: z.enum(["standard", "cip", "gas_hazard", "refrigerant"]),
  storage_location: z.string().min(1, "Storage location is required"),
  notes: z.string().optional(),
});

export type ChemicalFormValues = z.infer<typeof chemicalSchema>;

export const sdsUploadSchema = z.object({
  version: z.string().min(1, "SDS version/revision date is required"),
});
