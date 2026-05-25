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
import type { EquipmentType } from "@/types/database";

export function AddEquipmentForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<EquipmentType>("tank");
  const [location, setLocation] = useState("");
  const [confined, setConfined] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          equipment_type: type,
          location: location || null,
          is_confined_space: confined,
        }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Equipment added", variant: "success" });
      router.refresh();
      setName("");
      setLocation("");
    } catch {
      toast({ title: "Could not add equipment", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="eq-name">Name</Label>
        <Input
          id="eq-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label>Type</Label>
        <Select value={type} onValueChange={(v) => setType(v as EquipmentType)}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tank">Tank</SelectItem>
            <SelectItem value="fermenter">Fermenter</SelectItem>
            <SelectItem value="bright_tank">Bright tank</SelectItem>
            <SelectItem value="crusher">Crusher</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="eq-loc">Location</Label>
        <Input
          id="eq-loc"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={confined}
          onChange={(e) => setConfined(e.target.checked)}
        />
        Confined space
      </label>
      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Add equipment"}
      </Button>
    </form>
  );
}
