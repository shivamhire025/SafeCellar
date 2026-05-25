import { notFound } from "next/navigation";
import Link from "next/link";
import { workersRepository } from "@/lib/workers/repository";
import { trainingRepository } from "@/lib/training/repository";
import { getSession } from "@/lib/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { TrainingLogForm } from "@/components/workers/training-log-form";
import { formatDate } from "@/lib/utils";

export default async function WorkerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  const workers = await workersRepository.getWorkers();
  const worker = workers.find((w) => w.id === params.id);
  if (!worker) notFound();

  const training = await trainingRepository.getTrainingRecords(worker.id);

  return (
    <>
      <Topbar title={worker.full_name} userName={session?.full_name ?? "User"} />
      <PageShell
        title={worker.full_name}
        description={worker.role_title ?? undefined}
        leading={
          <Link
            href="/workers"
            className="text-sm text-brand-700 hover:underline"
          >
            ← Back to roster
          </Link>
        }
      >
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 max-w-xl">
          <dl className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <dt className="text-neutral-500">Phone</dt>
              <dd className="font-medium">{worker.phone ?? "N/A"}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Start date</dt>
              <dd>{formatDate(worker.start_date)}</dd>
            </div>
          </dl>

          <h3 className="text-base font-semibold text-neutral-900">
            Training history
          </h3>
          {training.length === 0 ? (
            <p className="text-sm text-neutral-500 mt-2">
              No training records yet. Log HazCom training below for OSHA documentation.
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {training.map((t) => (
                <li
                  key={t.id}
                  className="flex justify-between gap-4 border-b border-neutral-100 pb-2"
                >
                  <span className="font-medium capitalize">
                    {t.training_type.replace(/_/g, " ")}
                  </span>
                  <span className="text-neutral-500 shrink-0">
                    {formatDate(t.completed_at)}
                    {t.trainer ? ` · ${t.trainer}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <TrainingLogForm workerId={worker.id} />
        </div>
      </PageShell>
    </>
  );
}
