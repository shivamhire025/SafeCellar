import { z } from "zod";

export const CHEMICAL_IMPORT_HEADERS = [
  "name",
  "manufacturer",
  "chemical_type",
  "storage_location",
  "trade_name",
  "supplier",
  "cas_number",
  "barcode",
  "hazard_class",
  "notes",
] as const;

export const chemicalImportRowSchema = z.object({
  name: z.string().min(1, "Name is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  chemical_type: z.enum(["standard", "cip", "gas_hazard", "refrigerant"], {
    errorMap: () => ({
      message:
        "Type must be standard, cip, gas_hazard, or refrigerant",
    }),
  }),
  storage_location: z.string().min(1, "Storage location is required"),
  trade_name: z.string().optional(),
  supplier: z.string().optional(),
  cas_number: z.string().optional(),
  barcode: z.string().optional(),
  hazard_class: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export type ChemicalImportRow = z.infer<typeof chemicalImportRowSchema>;

export type ParsedImportRow = {
  rowNumber: number;
  raw: Record<string, string>;
  data?: ChemicalImportRow;
  error?: string;
};
