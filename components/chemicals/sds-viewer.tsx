"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

export function SdsViewer({ chemicalId, hasSds }: { chemicalId: string; hasSds: boolean }) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(hasSds);

  useEffect(() => {
    if (!hasSds) return;
    setLoading(true);
    fetch(`/api/sds/${chemicalId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setUrl(data.url))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [chemicalId, hasSds]);

  if (!hasSds) return null;

  if (loading) {
    return (
      <p className="text-sm text-neutral-500 flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Loading SDS…
      </p>
    );
  }

  if (error || !url) {
    return (
      <p className="text-sm text-red-600">Could not load SDS document.</p>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-neutral-200 overflow-hidden bg-neutral-50">
      <iframe
        src={url}
        title="Safety Data Sheet"
        className="w-full h-[480px] bg-white"
      />
    </div>
  );
}
