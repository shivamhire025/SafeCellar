import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { organizationRepository } from "@/lib/organization/repository";
import { isDemoMode } from "@/lib/demo-mode";

export async function PATCH(request: Request) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const org = await organizationRepository.updateOrganization({
    hazcom_responsible_person: body.hazcom_responsible_person,
    hazcom_labeling_policy: body.hazcom_labeling_policy,
    hazcom_non_routine_tasks: body.hazcom_non_routine_tasks,
    hazcom_multi_employer: body.hazcom_multi_employer,
    hazcom_training_approach: body.hazcom_training_approach,
    sds_access_method: body.sds_access_method,
  });

  if (!org) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }

  return NextResponse.json(org);
}
