import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getActivityHref } from "@/lib/activity";
import { formatRelativeTime } from "@/lib/utils";
import type { ActivityLogEntry } from "@/types/database";

function ActivityRow({ entry }: { entry: ActivityLogEntry }) {
  const href = getActivityHref(entry);
  const initials = (entry.actor_name ?? "SC")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const body = (
    <>
      <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700">
        {initials}
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm text-neutral-700">
          <span className="font-medium text-neutral-900">
            {entry.actor_name ?? "System"}
          </span>{" "}
          {entry.action}
        </p>
        <p className="text-xs text-neutral-400 mt-0.5">
          {formatRelativeTime(entry.created_at)}
        </p>
      </div>
      {href && (
        <ChevronRight
          className="h-4 w-4 flex-shrink-0 text-neutral-400 transition-colors group-hover:text-brand-700 mt-1"
          aria-hidden
        />
      )}
    </>
  );

  if (!href) {
    return (
      <div className="relative flex items-start gap-3 py-3">{body}</div>
    );
  }

  return (
    <Link
      href={href}
      className="group relative flex items-start gap-3 rounded-lg py-3 -mx-2 px-2 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
    >
      {body}
      <span className="sr-only">View details</span>
    </Link>
  );
}

export function RecentActivity({ entries }: { entries: ActivityLogEntry[] }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
      <h3 className="text-base font-semibold text-neutral-900 mb-4">
        Recent Activity
      </h3>
      {entries.length === 0 ? (
        <p className="text-sm text-neutral-500">No activity yet.</p>
      ) : (
        <ul role="list" className="relative">
          {entries.map((entry, index) => (
            <li key={entry.id} className="relative">
              {index < entries.length - 1 && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-4 top-9 bottom-0 border-l-2 border-dotted border-neutral-300"
                />
              )}
              {index > 0 && (
                <div
                  aria-hidden
                  className="mb-0 border-t border-dotted border-neutral-300"
                />
              )}
              <ActivityRow entry={entry} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
