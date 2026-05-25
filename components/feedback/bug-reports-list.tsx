"use client";

import { useState } from "react";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import type { BugReportTicket } from "@/types/database";

export function BugReportsList({
  initialTickets,
}: {
  initialTickets: BugReportTicket[];
}) {
  const [tickets, setTickets] = useState(initialTickets);

  async function setStatus(id: string, status: BugReportTicket["status"]) {
    const res = await fetch(`/api/bug-reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast({ title: "Update failed", variant: "destructive" });
      return;
    }
    const updated = await res.json();
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? updated : t))
    );
    toast({ title: status === "resolved" ? "Marked resolved" : "Reopened" });
  }

  if (tickets.length === 0) {
    return (
      <p className="text-sm text-neutral-500 py-8 text-center">
        No bug reports yet. Use the floating bug button to submit one.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-neutral-100">
      {tickets.map((ticket) => {
        const imageUrl =
          ticket.screenshot_annotated_url ??
          ticket.screenshot_original_url;
        return (
          <li key={ticket.id} className="py-5 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant={ticket.status === "open" ? "inventory_pending" : "complete"}
                >
                  {ticket.status === "open" ? "Open" : "Resolved"}
                </Badge>
                <span className="text-xs text-neutral-500">
                  {formatDateTime(ticket.created_at)}
                </span>
              </div>
              <div className="flex gap-2">
                {ticket.status === "open" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setStatus(ticket.id, "resolved")}
                  >
                    Mark resolved
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setStatus(ticket.id, "open")}
                  >
                    Reopen
                  </Button>
                )}
              </div>
            </div>
            <p className="text-sm text-neutral-800 whitespace-pre-wrap mb-2">
              {ticket.description}
            </p>
            <p className="text-xs text-neutral-500 mb-3">
              Page: <span className="font-mono">{ticket.page_url}</span>
              {ticket.reported_by_name && (
                <> · {ticket.reported_by_name}</>
              )}
            </p>
            {imageUrl && (
              <div className="rounded-lg border border-neutral-200 overflow-hidden max-w-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={ticket.screenshot_file_name ?? "Screenshot"}
                  className="w-full h-auto max-h-64 object-contain bg-neutral-50"
                />
                {ticket.annotation_strokes?.length ? (
                  <p className="text-xs text-brand-700 px-2 py-1 border-t border-neutral-100">
                    Screenshot annotated
                  </p>
                ) : null}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
