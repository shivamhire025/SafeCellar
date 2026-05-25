import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { organizationRepository } from "@/lib/organization/repository";
import { isDemoMode } from "@/lib/demo-mode";

export async function PATCH(request: Request) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const input: Record<string, unknown> = {};
  if (body.hazcom_responsible_person !== undefined)
    input.hazcom_responsible_person = body.hazcom_responsible_person;
  if (body.hazcom_labeling_policy !== undefined)
    input.hazcom_labeling_policy = body.hazcom_labeling_policy;
  if (body.hazcom_non_routine_tasks !== undefined)
    input.hazcom_non_routine_tasks = body.hazcom_non_routine_tasks;
  if (body.hazcom_multi_employer !== undefined)
    input.hazcom_multi_employer = body.hazcom_multi_employer;
  if (body.hazcom_training_approach !== undefined)
    input.hazcom_training_approach = body.hazcom_training_approach;
  if (body.sds_access_method !== undefined)
    input.sds_access_method = body.sds_access_method;
  if (body.regulatory_profile !== undefined)
    input.regulatory_profile = body.regulatory_profile;

  if (Object.keys(input).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const org = await organizationRepository.updateOrganization(
    input as Parameters<typeof organizationRepository.updateOrganization>[0]
  );

  if (!org) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }

  return NextResponse.json(org);
}
