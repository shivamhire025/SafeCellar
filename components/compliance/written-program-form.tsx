"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { getComplianceTerminology } from "@/lib/compliance/terminology";
import type { Organization, SdsAccessMethod } from "@/types/database";
import {
  DEFAULT_HAZCOM_LABELING,
  DEFAULT_HAZCOM_MULTI_EMPLOYER,
  DEFAULT_HAZCOM_NON_ROUTINE,
  DEFAULT_HAZCOM_TRAINING,
} from "@/lib/hazcom/defaults";
import { DownloadButton } from "@/components/compliance/download-button";

export function WrittenProgramForm({ org }: { org: Organization }) {
  const router = useRouter();
  const terms = getComplianceTerminology(org.regulatory_profile);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    hazcom_responsible_person: org.hazcom_responsible_person ?? "",
    hazcom_labeling_policy: org.hazcom_labeling_policy ?? "",
    hazcom_non_routine_tasks: org.hazcom_non_routine_tasks ?? "",
    hazcom_multi_employer: org.hazcom_multi_employer ?? "",
    hazcom_training_approach: org.hazcom_training_approach ?? "",
    sds_access_method: (org.sds_access_method ?? "digital") as SdsAccessMethod,
  });

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/organization/hazcom", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      toast({ title: terms.saveSuccessTitle, variant: "success" });
      router.refresh();
    } catch {
      toast({ title: "Could not save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 max-w-2xl">
      <h3 className="text-base font-semibold text-neutral-900 mb-2">
        {terms.programTitle}
      </h3>
      <p className="text-sm text-neutral-500 mb-6">
        {terms.programFormDescription}
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="responsible">Responsible person</Label>
          <Input
            id="responsible"
            value={form.hazcom_responsible_person}
            onChange={(e) =>
              setForm({ ...form, hazcom_responsible_person: e.target.value })
            }
            placeholder="Name and title"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="sds_access">SDS access method</Label>
          <Select
            value={form.sds_access_method}
            onValueChange={(v) =>
              setForm({ ...form, sds_access_method: v as SdsAccessMethod })
            }
          >
            <SelectTrigger id="sds_access" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="digital">Digital (SafeCellar)</SelectItem>
              <SelectItem value="binder">Printed binder</SelectItem>
              <SelectItem value="both">Digital and binder</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="labeling">Labels and warnings</Label>
          <textarea
            id="labeling"
            value={form.hazcom_labeling_policy}
            onChange={(e) =>
              setForm({ ...form, hazcom_labeling_policy: e.target.value })
            }
            placeholder={DEFAULT_HAZCOM_LABELING}
            rows={3}
            className="mt-1 flex w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="nonroutine">Non-routine tasks</Label>
          <textarea
            id="nonroutine"
            value={form.hazcom_non_routine_tasks}
            onChange={(e) =>
              setForm({ ...form, hazcom_non_routine_tasks: e.target.value })
            }
            placeholder={DEFAULT_HAZCOM_NON_ROUTINE}
            rows={3}
            className="mt-1 flex w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="multi">Multi-employer workplaces</Label>
          <textarea
            id="multi"
            value={form.hazcom_multi_employer}
            onChange={(e) =>
              setForm({ ...form, hazcom_multi_employer: e.target.value })
            }
            placeholder={DEFAULT_HAZCOM_MULTI_EMPLOYER}
            rows={3}
            className="mt-1 flex w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="training">Employee training</Label>
          <textarea
            id="training"
            value={form.hazcom_training_approach}
            onChange={(e) =>
              setForm({ ...form, hazcom_training_approach: e.target.value })
            }
            placeholder={DEFAULT_HAZCOM_TRAINING}
            rows={3}
            className="mt-1 flex w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save program"}
        </Button>
        <DownloadButton
          href="/api/reports/hazcom?format=pdf"
          label="Written program (PDF)"
          size="default"
        />
      </div>

      <p className="text-xs text-neutral-500 mt-4">{terms.disclaimer}</p>
    </div>
  );
}
