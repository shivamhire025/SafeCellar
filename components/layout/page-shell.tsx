import { AbbreviationText } from "@/components/shared/abbreviation-tooltip";

interface PageShellProps {
  title: string;
  description?: string;
  /** Renders above the title on the left (e.g. back navigation). */
  leading?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function PageShell({
  title,
  description,
  leading,
  actions,
  children,
}: PageShellProps) {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          {leading && <div className="mb-2">{leading}</div>}
          <h1 className="text-2xl font-bold text-neutral-900">
            <AbbreviationText text={title} />
          </h1>
          {description && (
            <p className="text-sm text-neutral-500 mt-1">
              <AbbreviationText text={description} />
            </p>
          )}
        </div>
        {actions && <div className="flex gap-3">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
