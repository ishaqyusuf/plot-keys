"use server";

import {
  type CompanyPlanTier,
  findAppById,
  isAppAvailable,
} from "@plotkeys/app-store/registry";
import { revalidatePath } from "next/cache";

import {
  getCompanyAppsState,
  setCompanyEnabledAppIds,
} from "../../../lib/company-apps";
import { requireOnboardedSession } from "../../../lib/session";

export type SetAppEnabledResult = { ok: true } | { error: string; ok: false };

export async function setAppEnabled(
  appId: string,
  enabled: boolean,
): Promise<SetAppEnabledResult> {
  const session = await requireOnboardedSession();
  const role = session.activeMembership.role;

  if (role !== "owner" && role !== "admin") {
    return {
      ok: false,
      error: "Only owners and admins can change enabled apps.",
    };
  }

  const app = findAppById(appId);
  if (!app) {
    return { ok: false, error: "Unknown app." };
  }

  const company = await getCompanyAppsState(session.activeMembership.companyId);

  if (!company) {
    return { ok: false, error: "Company not found." };
  }

  const planTier = company.planTier as CompanyPlanTier;

  if (enabled && !isAppAvailable(app, planTier)) {
    return {
      ok: false,
      error: `${app.label} requires the ${app.planGate} plan.`,
    };
  }

  const current = new Set(company.enabledIds);
  if (enabled) {
    current.add(app.id);
  } else {
    current.delete(app.id);
  }

  await setCompanyEnabledAppIds(
    session.activeMembership.companyId,
    Array.from(current),
  );

  revalidatePath("/app-store");
  revalidatePath("/", "layout");

  return { ok: true };
}
