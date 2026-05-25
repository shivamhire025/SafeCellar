import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function TrainingAlertCard({ missingCount }: { missingCount: number }) {
  if (missingCount <= 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
      <GraduationCap className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-amber-900">
          {missingCount} worker{missingCount === 1 ? "" : "s"} missing initial
          hazardous-chemical training
        </p>
        <p className="text-sm text-amber-800 mt-1">
          Document training on each worker profile for inspection readiness.
        </p>
        <div className="flex flex-wrap gap-3 mt-2">
          <Link
            href="/workers"
            className="text-sm font-medium text-brand-700 hover:underline"
          >
            View worker roster →
          </Link>
          <Link
            href="/compliance"
            className="text-sm font-medium text-brand-700 hover:underline"
          >
            Compliance & Exports →
          </Link>
        </div>
      </div>
    </div>
  );
}
