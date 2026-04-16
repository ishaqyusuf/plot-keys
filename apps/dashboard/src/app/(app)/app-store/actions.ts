"use server";

import {
  type CompanyPlanTier,
  findAppById,
  isAppAvailable,
} from "@plotkeys/app-store/registry";
import { createPrismaClient } from "@plotkeys/db";
import { revalidatePath } from "next/cache";

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

  const prisma = createPrismaClient().db;
  if (!prisma) {
    return { ok: false, error: "Database unavailable." };
  }

  const company = await prisma.company.findUnique({
    where: { id: session.activeMembership.companyId },
    select: { enabledApps: true, planTier: true },
  });

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

  const current = new Set(company.enabledApps ?? []);
  if (enabled) {
    current.add(app.id);
  } else {
    current.delete(app.id);
  }

  await prisma.company.update({
    where: { id: session.activeMembership.companyId },
    data: { enabledApps: Array.from(current) },
  });

  revalidatePath("/app-store");
  revalidatePath("/", "layout");

  return { ok: true };
}
