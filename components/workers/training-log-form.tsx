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
import type { TrainingType } from "@/types/database";

export function TrainingLogForm({ workerId }: { workerId: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [trainingType, setTrainingType] = useState<TrainingType>("hazcom_initial");
  const [completedAt, setCompletedAt] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [trainer, setTrainer] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          worker_id: workerId,
          training_type: trainingType,
          completed_at: completedAt,
          trainer: trainer || null,
        }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Training recorded", variant: "success" });
      router.refresh();
      setTrainer("");
    } catch {
      toast({ title: "Could not save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-neutral-100 pt-4 mt-4">
      <h4 className="text-sm font-semibold text-neutral-900">Log training</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Training type</Label>
          <Select
            value={trainingType}
            onValueChange={(v) => setTrainingType(v as TrainingType)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hazcom_initial">HazCom initial</SelectItem>
              <SelectItem value="hazcom_refresher">HazCom refresher</SelectItem>
              <SelectItem value="chemical_specific">Chemical-specific</SelectItem>
              <SelectItem value="confined_space">Confined space</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="completed">Completed date</Label>
          <Input
            id="completed"
            type="date"
            value={completedAt}
            onChange={(e) => setCompletedAt(e.target.value)}
            className="mt-1"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="trainer">Trainer</Label>
          <Input
            id="trainer"
            value={trainer}
            onChange={(e) => setTrainer(e.target.value)}
            className="mt-1"
            placeholder="Name of trainer"
          />
        </div>
      </div>
      <Button type="submit" size="sm" disabled={saving}>
        {saving ? "Saving…" : "Add record"}
      </Button>
    </form>
  );
}
