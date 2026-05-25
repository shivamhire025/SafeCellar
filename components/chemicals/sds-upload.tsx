"use client";

import { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface SdsUploadProps {
  chemicalId: string;
  onSuccess?: () => void;
}

export function SdsUpload({ chemicalId, onSuccess }: SdsUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [version, setVersion] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(async () => {
    if (!file || !version) {
      toast({
        title: "Missing information",
        description: "Please select a PDF and enter the SDS version.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("chemicalId", chemicalId);
    formData.append("version", version);

    try {
      const res = await fetch("/api/sds/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      toast({
        title: "SDS uploaded",
        description: "Compliance gate cleared. Chemical is now compliant.",
        variant: "success",
      });
      setFile(null);
      setVersion("");
      onSuccess?.();
    } catch {
      toast({
        title: "Upload failed",
        description: "Could not upload SDS. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [file, version, chemicalId, onSuccess]);

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-150 cursor-pointer ${
          isDragging
            ? "border-brand-500 bg-brand-50"
            : "border-neutral-300 hover:border-brand-400 hover:bg-neutral-50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const f = e.dataTransfer.files[0];
          if (f?.type === "application/pdf") setFile(f);
        }}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "application/pdf";
          input.onchange = (e) => {
            const f = (e.target as HTMLInputElement).files?.[0];
            if (f) setFile(f);
          };
          input.click();
        }}
      >
        <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-neutral-700">
          Drop SDS PDF here, or{" "}
          <span className="text-brand-700">click to browse</span>
        </p>
        <p className="text-xs text-neutral-400 mt-1">PDF files only, max 25MB</p>
        {file && (
          <p className="text-sm text-brand-700 mt-2 font-medium">{file.name}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sds-version">
          SDS Version / Revision Date <span className="text-red-500">*</span>
        </Label>
        <Input
          id="sds-version"
          placeholder="e.g. Rev 4.2, Jan 2025"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
        />
      </div>
      <Button onClick={handleUpload} disabled={uploading || !file}>
        {uploading ? "Uploading..." : "Upload SDS PDF"}
      </Button>
    </div>
  );
}
