const steps = [
  {
    step: "1",
    title: "Receive & scan",
    body: "Log deliveries and scan barcodes so new chemicals enter inventory with a clear audit trail.",
  },
  {
    step: "2",
    title: "Gate on SDS",
    body: "Non-compliant chemicals stay blocked until a current SDS is uploaded and reviewed.",
  },
  {
    step: "3",
    title: "See gaps early",
    body: "Dashboard score, queue tiles, and high-risk notifications show what needs attention before walkthrough day.",
  },
  {
    step: "4",
    title: "Train & document",
    body: "Worker training records, incident logs with photos, and activity history support OSHA documentation.",
  },
  {
    step: "5",
    title: "Export for inspection",
    body: "Download a compliance packet: written program, SDS library, summaries, and CSVs in one ZIP.",
  },
];

export function LandingWorkflow() {
  return (
    <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {steps.map((s) => (
        <li
          key={s.step}
          className="flex min-w-0 flex-col rounded-xl border border-neutral-200 bg-white p-4 shadow-card"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">
            {s.step}
          </span>
          <h3 className="mt-3 text-sm font-semibold text-neutral-900">{s.title}</h3>
          <p className="mt-2 text-xs leading-relaxed text-neutral-600">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
