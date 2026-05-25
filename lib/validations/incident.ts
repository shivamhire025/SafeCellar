import { z } from "zod";

export const incidentSchema = z.object({
  incident_type: z.enum(["near_miss", "injury", "illness", "property_damage"], {
    required_error: "Incident type is required",
  }),
  occurred_date: z.string().min(1, "Date is required"),
  occurred_time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  notes: z.string().optional(),
  chemical_exposure: z.boolean().default(false),
  chemical_ids: z.array(z.string()).optional(),
  exposure_details: z.string().optional(),
  conditions: z.string().optional(),
});

export type IncidentFormValues = z.infer<typeof incidentSchema>;

export function combineOccurredAt(date: string, time: string): string {
  return new Date(`${date}T${time}`).toISOString();
}
