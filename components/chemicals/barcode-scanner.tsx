"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;
    let active = true;

    async function start() {
      try {
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          (result) => {
            if (result && active) {
              active = false;
              onScan(result.getText());
            }
          }
        );
        return () => {
          controls?.stop();
        };
      } catch {
        setError(
          "Camera access denied or unavailable. Enter barcode manually."
        );
      }
    }

    const cleanup = start();

    return () => {
      active = false;
      cleanup?.then?.((stop) => stop?.());
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between p-4 bg-black/80">
        <button onClick={onClose} className="text-white">
          <X className="h-6 w-6" />
        </button>
        <span className="text-white font-medium text-sm">Scan Barcode</span>
        <div className="w-6" />
      </div>
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-32 border-2 border-white rounded-lg opacity-70" />
        </div>
      </div>
      <div className="p-4 bg-black/80 text-center">
        {error ? (
          <p className="text-red-400 text-sm mb-2">{error}</p>
        ) : (
          <p className="text-white text-sm mb-2">
            Point camera at barcode on container
          </p>
        )}
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
