"use client";

import { useEffect, useState } from "react";
import type { ComplianceStats } from "@/types/database";

export function useComplianceScore() {
  const [stats, setStats] = useState<ComplianceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/compliance");
        if (res.ok) setStats(await res.json());
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return { stats, loading };
}
