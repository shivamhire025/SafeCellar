import { z } from "zod";

const annotationStrokeSchema = z.object({
  tool: z.enum(["pen", "arrow", "circle", "text"]),
  color: z.string(),
  lineWidth: z.number(),
  points: z.array(z.number()),
  text: z.string().optional(),
});

export const bugReportSchema = z.object({
  description: z
    .string()
    .min(10, "Please describe the issue in at least 10 characters"),
  page_url: z.string().min(1),
  screenshot_file_name: z.string().optional().nullable(),
  screenshot_original_url: z.string().optional().nullable(),
  screenshot_annotated_url: z.string().optional().nullable(),
  annotation_strokes: z.array(annotationStrokeSchema).optional().nullable(),
});

export type BugReportFormValues = z.infer<typeof bugReportSchema>;
