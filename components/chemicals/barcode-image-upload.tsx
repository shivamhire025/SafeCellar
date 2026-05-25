"use client";

import { useRef, useState } from "react";
import { ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { decodeBarcodeFromImageFile } from "@/lib/barcode-decode";

interface BarcodeImageUploadProps {
  onScan: (code: string) => void;
  disabled?: boolean;
}

export function BarcodeImageUpload({ onScan, disabled }: BarcodeImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    try {
      const code = await decodeBarcodeFromImageFile(file);
      onScan(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read barcode from image.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-neutral-200">
      <p className="text-sm text-neutral-600 mb-2">
        Prefer not to use the camera? Upload a photo of the barcode.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled || loading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <Button
        type="button"
        variant="secondary"
        disabled={disabled || loading}
        onClick={() => inputRef.current?.click()}
      >
        <ImageUp className="h-4 w-4 mr-1.5" />
        {loading ? "Reading image…" : "Upload barcode photo"}
      </Button>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
