"use client";

import { NotificationsMenu } from "@/components/layout/notifications-menu";
import { AbbreviationText } from "@/components/shared/abbreviation-tooltip";

export function Topbar({
  title,
  userName,
}: {
  title: string;
  userName: string;
}) {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-[60px] bg-white border-b border-neutral-200 flex items-center justify-between px-6 flex-shrink-0">
      <h2 className="text-xl font-semibold text-neutral-900">
        <AbbreviationText text={title} />
      </h2>
      <div className="flex items-center gap-4">
        <NotificationsMenu />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-white text-xs font-medium">
            {initials}
          </div>
          <span className="text-sm font-medium text-neutral-700 hidden sm:block">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
}
