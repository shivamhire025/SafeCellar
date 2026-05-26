"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Topbar } from "@/components/layout/topbar";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IncidentPhotosPanel,
  type PendingPhoto,
} from "@/components/incidents/incident-photos-panel";
import {
  incidentSchema,
  combineOccurredAt,
  type IncidentFormValues,
} from "@/lib/validations/incident";
import { INCIDENT_TYPES, INCIDENT_CONDITIONS } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";
import type { Chemical } from "@/types/database";

export function NewIncidentForm({
  chemicals,
}: {
  chemicals: Chemical[];
}) {
  const router = useRouter();
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      incident_type: "near_miss",
      occurred_date: new Date().toISOString().slice(0, 10),
      occurred_time: new Date().toTimeString().slice(0, 5),
      location: "",
      description: "",
      notes: "",
      chemical_exposure: false,
      chemical_ids: [],
      exposure_details: "",
      conditions: "",
    },
  });

  const chemicalExposure = watch("chemical_exposure");
  const selectedChemicalIds = watch("chemical_ids") ?? [];

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) => {
      const next = prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition];
      setValue("conditions", next.join(", "));
      return next;
    });
  };

  const toggleChemical = (id: string) => {
    const next = selectedChemicalIds.includes(id)
      ? selectedChemicalIds.filter((c) => c !== id)
      : [...selectedChemicalIds, id];
    setValue("chemical_ids", next);
  };

  async function onSubmit(values: IncidentFormValues) {
    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incident_type: values.incident_type,
          occurred_at: combineOccurredAt(
            values.occurred_date,
            values.occurred_time
          ),
          location: values.location,
          description: values.description,
          notes: values.notes || null,
          chemical_exposure: values.chemical_exposure,
          chemical_ids: values.chemical_exposure ? values.chemical_ids : null,
          exposure_details: values.exposure_details || null,
          conditions: values.conditions || null,
          photos: photos.map((p) => ({
            file_name: p.file_name,
            original_data_url: p.original_data_url,
            annotated_data_url: p.annotated_data_url,
            annotation_strokes: p.annotation_strokes,
            caption: p.caption ?? null,
          })),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const incident = await res.json();
      toast({
        title: "Incident logged",
        description:
          incident.status === "incomplete"
            ? "Add photos on the detail page to mark this incident complete."
            : "Incident record is complete.",
        variant: incident.status === "incomplete" ? "default" : "success",
      });
      router.push(`/incidents/${incident.id}`);
    } catch {
      toast({
        title: "Could not save incident",
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <Topbar title="Log incident" userName="Marcus Chen" />
      <PageShell
        title="Log incident"
        description="Document what happened, where, and any chemical exposure or site conditions"
        leading={
          <Link
            href="/incidents"
            className="text-sm text-brand-700 hover:underline"
          >
            ← Back to incident log
          </Link>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
          <section className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-semibold text-neutral-900">
              Incident type
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {INCIDENT_TYPES.map((t) => (
                <label
                  key={t.value}
                  className={`flex items-center justify-center rounded-lg border px-3 py-3 text-sm font-medium cursor-pointer transition-colors ${
                    watch("incident_type") === t.value
                      ? "border-brand-600 bg-brand-50 text-brand-800"
                      : "border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    value={t.value}
                    {...register("incident_type")}
                  />
                  {t.label}
                </label>
              ))}
            </div>
            {errors.incident_type && (
              <p className="text-xs text-red-600">{errors.incident_type.message}</p>
            )}
          </section>

          <section className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-semibold text-neutral-900">
              When & where
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input type="date" {...register("occurred_date")} />
                {errors.occurred_date && (
                  <p className="text-xs text-red-600">
                    {errors.occurred_date.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>
                  Time <span className="text-red-500">*</span>
                </Label>
                <Input type="time" {...register("occurred_time")} />
                {errors.occurred_time && (
                  <p className="text-xs text-red-600">
                    {errors.occurred_time.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <Label>
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("location")}
                  placeholder="e.g. Cellar B, tank pad"
                />
                {errors.location && (
                  <p className="text-xs text-red-600">{errors.location.message}</p>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-semibold text-neutral-900">
              Description
            </h2>
            <div className="flex flex-col gap-1.5">
              <Label>
                What happened? <span className="text-red-500">*</span>
              </Label>
              <textarea
                {...register("description")}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md min-h-[100px]"
                placeholder="Describe the incident in detail…"
              />
              {errors.description && (
                <p className="text-xs text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Additional notes</Label>
              <textarea
                {...register("notes")}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md min-h-[60px]"
                placeholder="Follow-up actions, witnesses, etc."
              />
            </div>
          </section>

          <section className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-semibold text-neutral-900">
              Chemical exposure & conditions
            </h2>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="rounded border-neutral-300"
                {...register("chemical_exposure")}
              />
              Chemical exposure involved
            </label>
            {chemicalExposure && (
              <div className="space-y-3 pl-6 border-l-2 border-brand-200">
                <p className="text-xs text-neutral-500">
                  Select chemicals involved (if known)
                </p>
                <div className="flex flex-wrap gap-2">
                  {chemicals.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleChemical(c.id)}
                      className={`text-xs rounded-full px-2.5 py-1 border ${
                        selectedChemicalIds.includes(c.id)
                          ? "border-brand-600 bg-brand-50 text-brand-800"
                          : "border-neutral-200 text-neutral-600"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Exposure details</Label>
                  <textarea
                    {...register("exposure_details")}
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md min-h-[60px]"
                    placeholder="Route of exposure, PPE worn, symptoms…"
                  />
                </div>
              </div>
            )}
            <div>
              <Label className="mb-2 block">Site / work conditions</Label>
              <div className="flex flex-wrap gap-2">
                {INCIDENT_CONDITIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCondition(c)}
                    className={`text-xs rounded-full px-2.5 py-1 border ${
                      selectedConditions.includes(c)
                        ? "border-neutral-600 bg-neutral-100 text-neutral-800"
                        : "border-neutral-200 text-neutral-600"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
            <IncidentPhotosPanel photos={photos} onPhotosChange={setPhotos} />
          </section>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save incident"}
            </Button>
            <Button type="button" variant="secondary" asChild>
              <Link href="/incidents">Cancel</Link>
            </Button>
          </div>
        </form>
      </PageShell>
    </>
  );
}
