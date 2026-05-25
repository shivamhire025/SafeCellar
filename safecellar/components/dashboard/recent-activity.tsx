import { formatRelativeTime } from "@/lib/utils";
import type { ActivityLogEntry } from "@/types/database";

export function RecentActivity({ entries }: { entries: ActivityLogEntry[] }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
      <h3 className="text-base font-semibold text-neutral-900 mb-4">
        Recent Activity
      </h3>
      {entries.length === 0 ? (
        <p className="text-sm text-neutral-500">No activity yet.</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 text-brand-700 text-xs font-medium">
                {(entry.actor_name ?? "SC")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <p className="text-sm text-neutral-700">
                  <span className="font-medium text-neutral-900">
                    {entry.actor_name ?? "System"}
                  </span>{" "}
                  {entry.action}
                </p>
                <p className="text-xs text-neutral-400">
                  {formatRelativeTime(entry.created_at)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
