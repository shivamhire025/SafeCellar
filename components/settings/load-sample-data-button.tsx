"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function LoadSampleDataButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLoad() {
    setLoading(true);
    try {
      const res = await fetch("/api/organization/seed-sample", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        toast({
          title: "Could not load sample data",
          description: data.error ?? "Please try again.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Sample data loaded",
        description: "Chemical inventory, deliveries, and workers are ready to explore.",
        variant: "success",
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="secondary" onClick={handleLoad} disabled={loading}>
      {loading ? "Loading…" : "Load sample inventory"}
    </Button>
  );
}
