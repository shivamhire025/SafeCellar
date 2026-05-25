import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComplianceGateProps {
  chemicalName: string;
  onUpload?: () => void;
}

export function ComplianceGate({ chemicalName, onUpload }: ComplianceGateProps) {
  return (
    <div className="rounded-lg border-l-4 border-red-600 bg-red-50 p-4 flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <AlertTriangle className="h-5 w-5 text-red-600" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-red-800">
          SDS Required: This chemical is not compliant
        </h3>
        <p className="text-sm text-red-700 mt-1">
          Upload the Safety Data Sheet (SDS) for{" "}
          <strong>{chemicalName}</strong> to clear this compliance item. This
          flag will not clear automatically.
        </p>
      </div>
      {onUpload && (
        <Button variant="outline" size="sm" onClick={onUpload}>
          Upload SDS
        </Button>
      )}
    </div>
  );
}
