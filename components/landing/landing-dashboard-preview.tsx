/** High-fidelity static mock of the compliance dashboard for marketing. */
export function LandingDashboardPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "max-w-full overflow-hidden rounded-lg bg-white p-3 shadow-sm"
          : "max-w-full overflow-hidden rounded-lg bg-white p-4 shadow-sm sm:p-5"
      }
      aria-hidden
    >
      <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 sm:text-xs">
          Compliance overview
        </p>
        <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-800">
          Not inspection-ready
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className="relative mx-auto shrink-0 sm:mx-0"
          style={{ width: 144, height: 80, maxWidth: "100%" }}
        >
          <svg
            width={144}
            height={80}
            viewBox="0 0 180 100"
            className="block max-w-full"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <path
              d="M 20 90 A 70 70 0 0 1 160 90"
              fill="none"
              stroke="#E7E5E4"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 20 90 A 70 70 0 0 1 108 28"
              fill="none"
              stroke="#DC2626"
              strokeWidth="12"
              strokeLinecap="butt"
            />
          </svg>
          <span className="absolute inset-0 flex items-end justify-center pb-1 text-2xl font-bold text-red-600">
            40%
          </span>
        </div>
        <div className="min-w-0 flex-1 space-y-2 text-sm text-stone-600">
          <p>
            <span className="font-semibold text-stone-900">2</span> of 5 chemicals
            compliant
          </p>
          <p className="text-xs text-stone-500">2 missing SDS · 1 review due</p>
          <p className="text-xs font-medium text-brand-700">View pending actions</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          {
            label: "SDS status",
            value: "2",
            sub: "missing",
            tone: "text-red-700 bg-red-50 border-red-100",
          },
          {
            label: "Deliveries",
            value: "1",
            sub: "pending",
            tone: "text-amber-800 bg-amber-50 border-amber-100",
          },
          {
            label: "Review",
            value: "3",
            sub: "in queue",
            tone: "text-amber-800 bg-amber-50 border-amber-100",
          },
        ].map((c) => (
          <div
            key={c.label}
            className={`rounded-md border px-2 py-2 ${c.tone}`}
          >
            <p className="text-[9px] font-bold uppercase tracking-wide opacity-80">
              {c.label}
            </p>
            <p className="text-lg font-bold leading-none">{c.value}</p>
            <p className="text-[9px] opacity-80">{c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
