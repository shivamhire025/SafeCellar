"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

function filenameFromDisposition(header: string | null): string | undefined {
  if (!header) return undefined;
  const match = /filename="?([^";\n]+)"?/i.exec(header);
  return match?.[1]?.trim();
}

export function DownloadButton({
  href,
  label,
  variant = "secondary",
  size = "default",
  className,
}: {
  href: string;
  label: string;
  variant?: "default" | "secondary";
  size?: "default" | "sm";
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(href, { credentials: "include" });
      const type = res.headers.get("Content-Type") ?? "";

      if (!res.ok) {
        let message = "Download failed";
        if (type.includes("application/json")) {
          const body = await res.json();
          message = body.message ?? body.error ?? message;
        } else {
          message = (await res.text()).slice(0, 200) || message;
        }
        throw new Error(message);
      }

      if (
        type.includes("application/pdf") ||
        type.includes("application/zip") ||
        type.includes("text/csv")
      ) {
        const blob = await res.blob();
        const name =
          filenameFromDisposition(res.headers.get("Content-Disposition")) ??
          "download";
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }

      throw new Error("Unexpected response type");
    } catch (e) {
      toast({
        title: "Download failed",
        description: e instanceof Error ? e.message : "Try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={loading}
      onClick={handleDownload}
      className={cn(className)}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {label}
    </Button>
  );
}
