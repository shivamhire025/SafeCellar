"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScanBarcode } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarcodeScanner } from "@/components/chemicals/barcode-scanner";
import { BarcodeImageUpload } from "@/components/chemicals/barcode-image-upload";
import { chemicalSchema, type ChemicalFormValues } from "@/lib/validations/chemical";
import { CHEMICAL_TYPES, STORAGE_LOCATIONS } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";

export default function NewChemicalPage() {
  const router = useRouter();
  const [tab, setTab] = useState("manual");
  const [scanning, setScanning] = useState(false);
  const [newDetected, setNewDetected] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChemicalFormValues>({
    resolver: zodResolver(chemicalSchema),
    defaultValues: {
      chemical_type: "standard",
    },
  });

  const barcode = watch("barcode");

  async function onSubmit(data: ChemicalFormValues) {
    const res = await fetch("/api/chemicals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      toast({ title: "Error", description: "Failed to create chemical", variant: "destructive" });
      return;
    }
    const chemical = await res.json();
    toast({
      title: "Chemical added",
      description: "SDS review queue item created. Upload SDS to clear compliance gate.",
      variant: "warning",
    });
    router.push(`/chemicals/${chemical.id}`);
  }

  async function handleBarcodeScan(code: string) {
    setScanning(false);
    setValue("barcode", code);
    const res = await fetch(`/api/barcode/${encodeURIComponent(code)}`);
    const data = await res.json();
    if (data.found && data.chemical) {
      toast({
        title: "Chemical found",
        description: `${data.chemical.name} is already in the system.`,
        variant: "default",
      });
      router.push(`/chemicals/${data.chemical.id}`);
    } else {
      setNewDetected(true);
      setTab("manual");
      toast({
        title: "New chemical detected",
        description: "Please complete the SDS information.",
        variant: "default",
      });
    }
  }

  return (
    <>
      <Topbar title="Add Chemical" userName="Marcus Chen" />
      <PageShell title="Add Chemical" description="Manual entry or barcode scan">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="scan">Barcode Scan</TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="mt-6">
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8 text-center">
              <ScanBarcode className="h-12 w-12 text-brand-700 mx-auto mb-4" />
              <p className="text-sm text-neutral-600 mb-4">
                Point your camera at the barcode on the container
              </p>
              <Button onClick={() => setScanning(true)}>Open Camera Scanner</Button>
              <div className="mt-6">
                <Label>Can&apos;t scan? Enter barcode manually</Label>
                <Input
                  className="mt-2 max-w-xs mx-auto"
                  placeholder="UPC / barcode"
                  value={barcode ?? ""}
                  onChange={(e) => setValue("barcode", e.target.value)}
                />
                {barcode && (
                  <Button
                    className="mt-2"
                    variant="secondary"
                    onClick={() => handleBarcodeScan(barcode)}
                  >
                    Look up barcode
                  </Button>
                )}
              </div>
              <BarcodeImageUpload onScan={handleBarcodeScan} />
            </div>
          </TabsContent>

          <TabsContent value="manual" className="mt-6">
            {newDetected && (
              <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 mb-6 text-sm text-blue-800">
                New chemical detected. Please complete the SDS information.
              </div>
            )}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-6 max-w-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Chemical Name <span className="text-red-500">*</span></Label>
                  <Input {...register("name")} placeholder="e.g. Sodium Hydroxide" />
                  {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Trade Name</Label>
                  <Input {...register("trade_name")} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Manufacturer <span className="text-red-500">*</span></Label>
                  <Input {...register("manufacturer")} />
                  {errors.manufacturer && <p className="text-xs text-red-600">{errors.manufacturer.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Supplier</Label>
                  <Input {...register("supplier")} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>CAS Number</Label>
                  <Input {...register("cas_number")} className="font-mono" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Barcode</Label>
                  <Input {...register("barcode")} className="font-mono" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Chemical Type <span className="text-red-500">*</span></Label>
                  <Select
                    defaultValue="standard"
                    onValueChange={(v) =>
                      setValue("chemical_type", v as ChemicalFormValues["chemical_type"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CHEMICAL_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Storage Location <span className="text-red-500">*</span></Label>
                  <Input {...register("storage_location")} list="locations" />
                  <datalist id="locations">
                    {STORAGE_LOCATIONS.map((l) => (
                      <option key={l} value={l} />
                    ))}
                  </datalist>
                  {errors.storage_location && (
                    <p className="text-xs text-red-600">{errors.storage_location.message}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Notes</Label>
                <textarea
                  {...register("notes")}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:ring-2 focus:ring-brand-700 focus:outline-none min-h-[80px]"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" asChild>
                  <Link href="/chemicals">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  Save Chemical
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </PageShell>
      {scanning && (
        <BarcodeScanner
          onScan={handleBarcodeScan}
          onClose={() => setScanning(false)}
        />
      )}
    </>
  );
}
