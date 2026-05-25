"use client";

import { useState } from "react";
import { Bug } from "lucide-react";
import { BugReportDialog } from "@/components/feedback/bug-report-dialog";
import { cn } from "@/lib/utils";

export function BugReportFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed z-40 flex h-14 w-14 items-center justify-center rounded-full",
          "bg-brand-700 text-white shadow-lg hover:bg-brand-800",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2",
          "transition-colors duration-150",
          "bottom-20 right-4 md:bottom-6 md:right-6"
        )}
        aria-label="Report a bug"
        title="Report a bug"
      >
        <Bug className="h-6 w-6" />
      </button>
      <BugReportDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
