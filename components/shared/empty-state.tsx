import type { LucideIcon } from "lucide-react";
import { AbbreviationText } from "@/components/shared/abbreviation-tooltip";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-brand-700" />
      </div>
      <h3 className="text-base font-semibold text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-sm mb-6">
        <AbbreviationText text={description} />
      </p>
      {action}
    </div>
  );
}
