/** Static marketing mock of the compliance overview (not live data). */
export function LandingDashboardPreview() {
  return (
    <div
      className="rounded-xl border border-neutral-200 bg-white p-5 shadow-elevated"
      aria-hidden
    >
      <p className="text-xs font-bold uppercase tracking-wide text-red-700">
        Compliance Score
      </p>
      <div className="mt-4 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="relative w-32 aspect-[9/5] flex-shrink-0">
          <svg viewBox="0 0 180 100" className="h-full w-full">
            <path
              d="M 20 90 A 70 70 0 0 1 160 90"
              fill="none"
              stroke="#E5E7EB"
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
            {[0, 25, 50, 75, 100].map((pct) => {
              const angle = Math.PI + (pct / 100) * Math.PI;
              const cx = 90;
              const cy = 90;
              const r1 = 78;
              const r2 = 85;
              return (
                <line
                  key={pct}
                  x1={cx + r1 * Math.cos(angle)}
                  y1={cy + r1 * Math.sin(angle)}
                  x2={cx + r2 * Math.cos(angle)}
                  y2={cy + r2 * Math.sin(angle)}
                  stroke="#9CA3AF"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
          <span className="absolute inset-0 flex items-end justify-center pb-1 text-2xl font-bold text-red-600">
            40%
          </span>
        </div>
        <div className="text-sm text-neutral-600 space-y-1">
          <span className="inline-block rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-900">
            Not inspection-ready
          </span>
          <p>
            <span className="font-semibold text-neutral-900">2</span> of 5 chemicals
            compliant
          </p>
          <p className="text-xs">2 missing SDS · 1 review due</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "SDS Status", value: "2", sub: "missing", color: "text-red-700" },
          { label: "Deliveries", value: "1", sub: "pending scan", color: "text-amber-700" },
          { label: "Review queue", value: "3", sub: "items", color: "text-amber-700" },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-lg border border-neutral-100 bg-neutral-50 px-2 py-2"
          >
            <p className="text-[10px] font-bold uppercase text-neutral-500">{c.label}</p>
            <p className={`text-lg font-bold ${c.color}`}>{c.value}</p>
            <p className="text-[10px] text-neutral-500">{c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
