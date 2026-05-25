import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function TrainingAlertCard({ missingCount }: { missingCount: number }) {
  if (missingCount <= 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
      <GraduationCap className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-amber-900">
          {missingCount} worker{missingCount === 1 ? "" : "s"} missing initial HazCom training
        </p>
        <p className="text-sm text-amber-800 mt-1">
          OSHA 1910.1200(h) requires training records. Log completion on each worker profile.
        </p>
        <Link
          href="/workers"
          className="text-sm font-medium text-brand-700 hover:underline mt-2 inline-block"
        >
          View worker roster →
        </Link>
      </div>
    </div>
  );
}
