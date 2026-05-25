"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser";
import { ImageUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { decodeBarcodeFromImageFile } from "@/lib/barcode-decode";

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const VIDEO_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    facingMode: { ideal: "environment" },
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
};

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    setVideoEl(node);
  }, []);

  useEffect(() => {
    if (!videoEl) return;

    const reader = new BrowserMultiFormatReader();
    let active = true;
    let controls: IScannerControls | null = null;

    async function start() {
      try {
        controls = await reader.decodeFromConstraints(
          VIDEO_CONSTRAINTS,
          videoEl,
          (result) => {
            if (result && active) {
              active = false;
              onScan(result.getText());
            }
          }
        );
      } catch {
        if (active) {
          setError(
            "Camera access denied or unavailable. Enter barcode manually or upload a photo."
          );
        }
      }
    }

    void start();

    return () => {
      active = false;
      controls?.stop();
      reader.reset();
    };
  }, [videoEl, onScan]);

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const code = await decodeBarcodeFromImageFile(file);
      onScan(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read barcode from image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between p-4 bg-black/80 shrink-0">
        <button type="button" onClick={onClose} className="text-white" aria-label="Close scanner">
          <X className="h-6 w-6" />
        </button>
        <span className="text-white font-medium text-sm">Scan Barcode</span>
        <div className="w-6" />
      </div>
      <div className="flex-1 relative min-h-0 bg-black">
        <video
          ref={setVideoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          autoPlay
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-32 border-2 border-white rounded-lg opacity-70" />
        </div>
      </div>
      <div className="p-4 bg-black/80 text-center shrink-0 space-y-2">
        {error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : (
          <p className="text-white text-sm">
            Point camera at barcode on container
          </p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleImageUpload(file);
          }}
        />
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageUp className="h-4 w-4 mr-1.5" />
            {uploading ? "Reading image…" : "Upload barcode photo"}
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
