"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import type { Organization, RegulatoryProfile } from "@/types/database";

export function RegulatoryProfileSelector({ org }: { org: Organization }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<RegulatoryProfile>(
    org.regulatory_profile ?? "ca"
  );

  async function handleChange(value: RegulatoryProfile) {
    setProfile(value);
    setSaving(true);
    try {
      const res = await fetch("/api/organization/hazcom", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regulatory_profile: value }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast({ title: "Regulatory profile updated", variant: "success" });
      router.refresh();
    } catch {
      toast({ title: "Could not save profile", variant: "destructive" });
      setProfile(org.regulatory_profile ?? "ca");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 max-w-2xl">
      <h3 className="text-base font-semibold text-neutral-900 mb-2">
        Regulatory framework
      </h3>
      <p className="text-sm text-neutral-500 mb-4">
        Controls labels and wording in your written program and compliance packet
        exports. Core requirements (SDS, inventory, training) are the same for GHS
        workplaces.
      </p>
      <div>
        <Label htmlFor="regulatory_profile">Jurisdiction</Label>
        <Select
          value={profile}
          onValueChange={(v) => handleChange(v as RegulatoryProfile)}
          disabled={saving}
        >
          <SelectTrigger id="regulatory_profile" className="mt-1 max-w-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ca">Canada (WHMIS)</SelectItem>
            <SelectItem value="us">United States (OSHA HazCom)</SelectItem>
            <SelectItem value="both">Both (US and Canada)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
