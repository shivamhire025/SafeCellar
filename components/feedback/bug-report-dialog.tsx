"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ImagePlus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IncidentPhotoAnnotator } from "@/components/incidents/incident-photo-annotator";
import { toast } from "@/components/ui/use-toast";
import type { AnnotationStroke } from "@/types/database";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface BugReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted?: () => void;
}

export function BugReportDialog({
  open,
  onOpenChange,
  onSubmitted,
}: BugReportDialogProps) {
  const pathname = usePathname();
  const [description, setDescription] = useState("");
  const [screenshot, setScreenshot] = useState<{
    file_name: string;
    original_url: string;
    annotated_url: string;
    strokes: AnnotationStroke[] | null;
  } | null>(null);
  const [annotating, setAnnotating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setDescription("");
    setScreenshot(null);
    setAnnotating(false);
  }

  function handleClose(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file?.type.startsWith("image/")) return;
    const dataUrl = await readFileAsDataUrl(file);
    setScreenshot({
      file_name: file.name,
      original_url: dataUrl,
      annotated_url: dataUrl,
      strokes: null,
    });
    setAnnotating(false);
  }

  async function handleSubmit() {
    if (description.trim().length < 10) {
      toast({
        title: "Description required",
        description: "Please describe the bug in at least 10 characters.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bug-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          page_url: pathname,
          screenshot_file_name: screenshot?.file_name ?? null,
          screenshot_original_url: screenshot?.original_url ?? null,
          screenshot_annotated_url: screenshot?.annotated_url ?? null,
          annotation_strokes: screenshot?.strokes ?? null,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast({
        title: "Bug report submitted",
        description: "Thank you — the team can review it in Bug reports.",
        variant: "success",
      });
      handleClose(false);
      onSubmitted?.();
    } catch {
      toast({
        title: "Could not submit report",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={
          annotating
            ? "max-w-3xl max-h-[90vh] overflow-y-auto"
            : "max-w-lg max-h-[90vh] overflow-y-auto"
        }
      >
        <DialogHeader>
          <DialogTitle>Report a bug</DialogTitle>
          <DialogDescription>
            Describe what went wrong. Add a screenshot and mark up the problem
            area if helpful.
          </DialogDescription>
        </DialogHeader>

        {annotating && screenshot ? (
          <IncidentPhotoAnnotator
            imageUrl={screenshot.original_url}
            initialStrokes={screenshot.strokes ?? []}
            maxDisplayHeight={Math.min(520, Math.floor(window.innerHeight * 0.6))}
            onSave={({ strokes, annotatedDataUrl }) => {
              setScreenshot({
                ...screenshot,
                strokes,
                annotated_url: annotatedDataUrl,
              });
              setAnnotating(false);
              toast({ title: "Screenshot annotated", variant: "success" });
            }}
            onCancel={() => setAnnotating(false)}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bug-description">
                Description <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="bug-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md min-h-[100px]"
                placeholder="What happened? What did you expect?"
              />
              <p className="text-xs text-neutral-500">
                Page: <span className="font-mono">{pathname}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label>Screenshot (optional)</Label>
              {!screenshot ? (
                <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      handleFile(e.target.files);
                      e.target.value = "";
                    }}
                  />
                  <ImagePlus className="h-8 w-8 text-neutral-400 mb-2" />
                  <span className="text-sm font-medium text-neutral-700">
                    Upload screenshot
                  </span>
                  <span className="text-xs text-neutral-500 mt-1">
                    PNG or JPG
                  </span>
                </label>
              ) : (
                <div className="rounded-lg border border-neutral-200 overflow-hidden">
                  <div className="relative aspect-video bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={screenshot.annotated_url}
                      alt="Screenshot"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-2 flex gap-2 justify-end border-t border-neutral-100">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setAnnotating(true)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Annotate
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => setScreenshot(null)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleClose(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit report"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
