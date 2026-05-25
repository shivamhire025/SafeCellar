import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-mode";
import { trainingRepository } from "@/lib/training/repository";

export async function GET(request: Request) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workerId = new URL(request.url).searchParams.get("worker_id") ?? undefined;
  const records = await trainingRepository.getTrainingRecords(workerId);
  return NextResponse.json(records);
}

export async function POST(request: Request) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const record = await trainingRepository.createTrainingRecord({
    worker_id: body.worker_id,
    training_type: body.training_type,
    completed_at: body.completed_at,
    trainer: body.trainer,
    notes: body.notes,
    chemical_id: body.chemical_id,
  });

  if (!record) {
    return NextResponse.json({ error: "Failed to create record" }, { status: 400 });
  }

  return NextResponse.json(record, { status: 201 });
}
