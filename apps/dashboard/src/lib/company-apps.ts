import {
  type AppDefinition,
  type CompanyPlanTier,
  GLOBAL_PLATFORM_GROUP,
  GLOBAL_TOP_ITEMS,
  getAvailableApps,
  getEnabledApps,
} from "@plotkeys/app-store/registry";
import { createPrismaClient } from "@plotkeys/db";
import { cache } from "react";

import { requireOnboardedSession } from "./session";

export type CompanyAppsContext = {
  availableApps: readonly AppDefinition[];
  enabledApps: readonly AppDefinition[];
  planTier: CompanyPlanTier;
};

type CompanyAppsState = {
  enabledIds: string[];
  planTier: CompanyPlanTier;
};

type CompanyAppsStateRow = {
  enabledApps: string[] | null;
  planTier: CompanyPlanTier | null;
};

export async function getCompanyAppsState(
  companyId: string,
): Promise<CompanyAppsState | null> {
  const prisma = createPrismaClient().db;

  if (!prisma) {
    return null;
  }

  const rows = await prisma.$queryRaw<CompanyAppsStateRow[]>`
    SELECT
      enabled_apps AS "enabledApps",
      plan_tier AS "planTier"
    FROM companies
    WHERE id = CAST(${companyId} AS uuid)
    LIMIT 1
  `;

  const company = rows[0];

  if (!company) {
    return null;
  }

  return {
    enabledIds: company.enabledApps ?? [],
    planTier: (company.planTier ?? "starter") as CompanyPlanTier,
  };
}

export async function setCompanyEnabledAppIds(
  companyId: string,
  enabledIds: readonly string[],
): Promise<void> {
  const prisma = createPrismaClient().db;

  if (!prisma) {
    throw new Error("Database unavailable.");
  }

  await prisma.$executeRaw`
    UPDATE companies
    SET
      enabled_apps = ${Array.from(enabledIds)},
      updated_at = NOW()
    WHERE id = CAST(${companyId} AS uuid)
  `;
}

/**
 * Loads the tenant's plan tier + enabled apps and resolves them against the
 * registry. Cached per-request so multiple callers in the same RSC tree
 * (layout, sidebar, header, page) share a single DB round-trip.
 */
export const getCompanyAppsContext = cache(
  async (): Promise<CompanyAppsContext> => {
    const session = await requireOnboardedSession();
    const company = await getCompanyAppsState(
      session.activeMembership.companyId,
    );
    const planTier = company?.planTier ?? "starter";
    const enabledIds = company?.enabledIds ?? [];

    return {
      availableApps: getAvailableApps(planTier),
      enabledApps: getEnabledApps(planTier, enabledIds),
      planTier,
    };
  },
);

export { GLOBAL_PLATFORM_GROUP, GLOBAL_TOP_ITEMS };
