"use client";

import { useCallback, useState } from "react";
import { ImagePlus, Pencil, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IncidentPhotoAnnotator } from "@/components/incidents/incident-photo-annotator";
import { toast } from "@/components/ui/use-toast";
import type { Incident, IncidentPhoto } from "@/types/database";

export type PendingPhoto = {
  file_name: string;
  original_data_url: string;
  annotated_data_url: string;
  annotation_strokes: IncidentPhoto["annotation_strokes"];
  caption?: string;
};

interface IncidentPhotosPanelProps {
  incidentId?: string;
  photos: IncidentPhoto[] | PendingPhoto[];
  onPhotosChange?: (photos: PendingPhoto[]) => void;
  onIncidentUpdate?: (incident: Incident) => void;
  readOnly?: boolean;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function isPending(
  photos: IncidentPhoto[] | PendingPhoto[]
): photos is PendingPhoto[] {
  return photos.length === 0 || !("id" in photos[0]);
}

export function IncidentPhotosPanel({
  incidentId,
  photos,
  onPhotosChange,
  onIncidentUpdate,
  readOnly = false,
}: IncidentPhotosPanelProps) {
  const [annotating, setAnnotating] = useState<{
    index: number;
    photoId?: string;
    url: string;
    strokes: IncidentPhoto["annotation_strokes"];
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      const pending: PendingPhoto[] = isPending(photos) ? [...photos] : [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const dataUrl = await readFileAsDataUrl(file);
        const entry: PendingPhoto = {
          file_name: file.name,
          original_data_url: dataUrl,
          annotated_data_url: dataUrl,
          annotation_strokes: null,
        };

        if (incidentId && onIncidentUpdate) {
          const res = await fetch(`/api/incidents/${incidentId}/photos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry),
          });
          if (res.ok) {
            const data = await res.json();
            onIncidentUpdate(data.incident);
          }
        } else {
          pending.push(entry);
        }
      }

      if (!incidentId && onPhotosChange) {
        onPhotosChange(pending);
      }
    },
    [incidentId, onIncidentUpdate, onPhotosChange, photos]
  );

  const openAnnotator = (
    index: number,
    url: string,
    strokes: IncidentPhoto["annotation_strokes"],
    photoId?: string
  ) => {
    setAnnotating({ index, photoId, url, strokes: strokes ?? [] });
  };

  const saveAnnotations = async (result: {
    strokes: NonNullable<IncidentPhoto["annotation_strokes"]>;
    annotatedDataUrl: string;
  }) => {
    if (!annotating) return;
    setSaving(true);
    try {
      if (incidentId && annotating.photoId && onIncidentUpdate) {
        const res = await fetch(
          `/api/incidents/${incidentId}/photos/${annotating.photoId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              annotation_strokes: result.strokes,
              annotated_data_url: result.annotatedDataUrl,
            }),
          }
        );
        if (!res.ok) throw new Error("Save failed");
        const data = await res.json();
        onIncidentUpdate(data.incident);
      } else if (onPhotosChange && isPending(photos)) {
        const next = [...photos];
        next[annotating.index] = {
          ...next[annotating.index],
          annotation_strokes: result.strokes,
          annotated_data_url: result.annotatedDataUrl,
        };
        onPhotosChange(next);
      }
      setAnnotating(null);
      toast({ title: "Annotations saved", variant: "success" });
    } catch {
      toast({
        title: "Could not save annotations",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const removePhoto = async (index: number, photoId?: string) => {
    if (incidentId && photoId && onIncidentUpdate) {
      const res = await fetch(
        `/api/incidents/${incidentId}/photos/${photoId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        const data = await res.json();
        onIncidentUpdate(data.incident);
      }
      return;
    }
    if (onPhotosChange && isPending(photos)) {
      onPhotosChange(photos.filter((_, i) => i !== index));
    }
  };

  const displayPhotos = photos as (IncidentPhoto | PendingPhoto)[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-semibold text-neutral-900">
            Photos
          </Label>
          <p className="text-xs text-neutral-500 mt-0.5">
            Upload scene photos and annotate injuries, spills, or damage.
            Incidents without photos are marked incomplete.
          </p>
        </div>
        {!readOnly && (
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => {
                handleUpload(e.target.files);
                e.target.value = "";
              }}
            />
            <span className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-3 py-2 text-sm font-medium text-white hover:bg-brand-800">
              <Upload className="h-4 w-4" />
              Add photos
            </span>
          </label>
        )}
      </div>

      {displayPhotos.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
          <ImagePlus className="h-10 w-10 text-neutral-400 mx-auto mb-2" />
          <p className="text-sm text-neutral-600">No photos yet</p>
          <p className="text-xs text-neutral-500 mt-1">
            Add at least one photo to mark this incident complete.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayPhotos.map((photo, index) => {
            const src =
              photo.annotated_data_url ?? photo.original_data_url;
            const photoId = "id" in photo ? photo.id : undefined;
            return (
              <div
                key={photoId ?? `pending-${index}`}
                className="rounded-lg border border-neutral-200 overflow-hidden bg-white"
              >
                <div className="relative aspect-video bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={photo.file_name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-3 flex items-center justify-between gap-2">
                  <p className="text-xs text-neutral-600 truncate flex-1">
                    {photo.file_name}
                    {photo.annotation_strokes?.length ? (
                      <span className="text-brand-600 ml-1">· annotated</span>
                    ) : null}
                  </p>
                  {!readOnly && (
                    <div className="flex gap-1 shrink-0">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          openAnnotator(
                            index,
                            photo.original_data_url,
                            photo.annotation_strokes,
                            photoId
                          )
                        }
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Annotate
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => removePhoto(index, photoId)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog
        open={annotating !== null}
        onOpenChange={(open) => !open && setAnnotating(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Annotate photo</DialogTitle>
          </DialogHeader>
          {annotating && (
            <IncidentPhotoAnnotator
              imageUrl={annotating.url}
              initialStrokes={annotating.strokes ?? []}
              onSave={saveAnnotations}
              onCancel={() => setAnnotating(null)}
              saving={saving}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
