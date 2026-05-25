"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  formatEquipmentLabel,
  suggestPermitHazards,
} from "@/lib/permits/suggest-hazards";
import type { Chemical, Equipment } from "@/types/database";

export function CreatePermitForm({
  confinedEquipment,
  chemicals,
  defaultAttendant,
}: {
  confinedEquipment: Equipment[];
  chemicals: Chemical[];
  defaultAttendant?: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [equipmentId, setEquipmentId] = useState("");
  const [permitNumber, setPermitNumber] = useState("");
  const [entryDate, setEntryDate] = useState(() =>
    new Date().toISOString().slice(0, 16)
  );
  const [entrants, setEntrants] = useState("");
  const [attendant, setAttendant] = useState(defaultAttendant ?? "");
  const [supervisor, setSupervisor] = useState(defaultAttendant ?? "");
  const [hazards, setHazards] = useState("");
  const [rescuePlan, setRescuePlan] = useState(
    "Tripod and winch at entry point; attendant maintains communication; call 911 for emergency rescue."
  );
  const [o2, setO2] = useState("");
  const [co2, setCo2] = useState("");
  const [lel, setLel] = useState("");

  const selectedEquipment = useMemo(
    () => confinedEquipment.find((e) => e.id === equipmentId),
    [confinedEquipment, equipmentId]
  );

  useEffect(() => {
    if (!selectedEquipment) return;
    const suggested = suggestPermitHazards(selectedEquipment, chemicals);
    setHazards(suggested.join("\n"));
  }, [selectedEquipment, chemicals]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!equipmentId) {
      toast({ title: "Select equipment", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const atmospheric: Record<string, string> = {};
      if (o2.trim()) atmospheric.o2 = o2.trim();
      if (co2.trim()) atmospheric.co2 = co2.trim();
      if (lel.trim()) atmospheric.lel = lel.trim();

      const res = await fetch("/api/permits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipment_id: equipmentId,
          permit_number: permitNumber.trim() || null,
          entry_date: new Date(entryDate).toISOString(),
          entrant_names: entrants
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          attendant_name: attendant.trim() || null,
          supervisor_name: supervisor.trim() || null,
          hazards_identified: hazards
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          rescue_plan: rescuePlan.trim() || null,
          atmospheric_results:
            Object.keys(atmospheric).length > 0 ? atmospheric : null,
          status: "active",
        }),
      });

      if (!res.ok) throw new Error("Failed");
      toast({ title: "Permit created", variant: "success" });
      router.refresh();
      setPermitNumber("");
      setEntrants("");
      setO2("");
      setCo2("");
      setLel("");
    } catch {
      toast({ title: "Could not create permit", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  if (confinedEquipment.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
        <h3 className="text-base font-semibold text-neutral-900 mb-2">
          Create entry permit
        </h3>
        <p className="text-sm text-neutral-500">
          Add equipment and mark it as a confined space before creating a permit.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
      <h3 className="text-base font-semibold text-neutral-900 mb-2">
        Create entry permit
      </h3>
      <p className="text-sm text-neutral-500 mb-4">
        Document one authorized confined-space entry (29 CFR 1910.146). Hazards
        prefill from linked chemicals and gas-hazard inventory when available.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <Label>Confined space equipment</Label>
          <Select value={equipmentId} onValueChange={setEquipmentId} required>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select equipment" />
            </SelectTrigger>
            <SelectContent>
              {confinedEquipment.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {formatEquipmentLabel(e)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="permit-number">Permit number (optional)</Label>
          <Input
            id="permit-number"
            value={permitNumber}
            onChange={(e) => setPermitNumber(e.target.value)}
            placeholder="CS-2026-001"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="entry-date">Entry date & time</Label>
          <Input
            id="entry-date"
            type="datetime-local"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="entrants">Entrant names (comma-separated)</Label>
          <Input
            id="entrants"
            value={entrants}
            onChange={(e) => setEntrants(e.target.value)}
            placeholder="Jane Doe, John Smith"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="attendant">Attendant</Label>
            <Input
              id="attendant"
              value={attendant}
              onChange={(e) => setAttendant(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="supervisor">Entry supervisor</Label>
            <Input
              id="supervisor"
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="hazards">Hazards identified (one per line)</Label>
          <textarea
            id="hazards"
            value={hazards}
            onChange={(e) => setHazards(e.target.value)}
            rows={4}
            className="mt-1 flex w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
          />
        </div>

        <div>
          <Label>Atmospheric readings (optional)</Label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <Input
              value={o2}
              onChange={(e) => setO2(e.target.value)}
              placeholder="O₂ %"
            />
            <Input
              value={co2}
              onChange={(e) => setCo2(e.target.value)}
              placeholder="CO₂ %"
            />
            <Input
              value={lel}
              onChange={(e) => setLel(e.target.value)}
              placeholder="LEL %"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="rescue">Rescue plan</Label>
          <textarea
            id="rescue"
            value={rescuePlan}
            onChange={(e) => setRescuePlan(e.target.value)}
            rows={3}
            className="mt-1 flex w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
          />
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? "Creating…" : "Create permit"}
        </Button>
      </form>
    </div>
  );
}
