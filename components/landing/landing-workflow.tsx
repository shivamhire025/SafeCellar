const steps = [
  { step: 1, title: "Receive & scan", body: "Log deliveries and barcode scans." },
  { step: 2, title: "Gate on SDS", body: "Block use until SDS is reviewed." },
  { step: 3, title: "See gaps early", body: "Score, tiles, and notifications." },
  { step: 4, title: "Train & document", body: "Training records and incidents." },
  { step: 5, title: "Export for inspection", body: "One ZIP for walkthrough day." },
];

export function LandingWorkflow() {
  return (
    <ol className="relative grid gap-8 lg:grid-cols-5 lg:gap-4">
      <div
        className="absolute left-0 right-0 top-5 hidden h-px bg-stone-300 lg:block"
        aria-hidden
      />
      {steps.map((s) => (
        <li key={s.step} className="relative flex gap-4 lg:block lg:text-center">
          <span className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-amber-200 bg-white font-landing-display text-sm font-semibold text-brand-800 shadow-sm lg:mx-auto">
            {s.step}
          </span>
          <div className="min-w-0 pt-0.5 lg:mt-4">
            <h3 className="font-landing-display text-base font-semibold text-stone-900">
              {s.title}
            </h3>
            <p className="mt-1 text-sm text-stone-600">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
