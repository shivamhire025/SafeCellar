import { FileArchive, FileText, Table } from "lucide-react";

const packetItems = [
  {
    icon: FileText,
    title: "Written HazCom / WHMIS program",
    desc: "PDF or HTML aligned to your jurisdiction (US, Canada, or both)",
  },
  {
    icon: FileArchive,
    title: "SDS document folder",
    desc: "Current safety data sheets organized for the chemicals on site",
  },
  {
    icon: Table,
    title: "Audit CSVs",
    desc: "Activity log, SDS review queue, deliveries, and training records",
  },
];

export function LandingPacketDiagram() {
  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-6">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-md">
          <FileArchive className="h-10 w-10" aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-neutral-900">
            One-click compliance packet
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            Everything an inspector typically asks for, bundled as a single ZIP from
            Compliance &amp; Exports.
          </p>
          <ul className="mt-4 space-y-3">
            {packetItems.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 shadow-sm">
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">{title}</p>
                  <p className="text-xs text-neutral-600">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
