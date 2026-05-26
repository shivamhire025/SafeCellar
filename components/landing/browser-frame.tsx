import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function BrowserFrame({
  children,
  className,
  url = "app.safecellar.com/dashboard",
}: {
  children: ReactNode;
  className?: string;
  url?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-[0_24px_60px_-12px_rgba(28,25,23,0.28)]",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-stone-100 bg-stone-50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" aria-hidden />
        <span className="ml-2 truncate text-[11px] text-stone-500">{url}</span>
      </div>
      <div className="bg-neutral-100 p-1 sm:p-2">{children}</div>
    </div>
  );
}
