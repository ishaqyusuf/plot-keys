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

/**
 * Loads the tenant's plan tier + enabled apps and resolves them against the
 * registry. Cached per-request so multiple callers in the same RSC tree
 * (layout, sidebar, header, page) share a single DB round-trip.
 */
export const getCompanyAppsContext = cache(
  async (): Promise<CompanyAppsContext> => {
    const session = await requireOnboardedSession();
    const prisma = createPrismaClient().db;

    if (!prisma) {
      return {
        availableApps: [],
        enabledApps: [],
        planTier: "starter",
      };
    }

    const company = await prisma.company.findUnique({
      where: { id: session.activeMembership.companyId },
      select: { enabledApps: true, planTier: true },
    });

    const planTier = (company?.planTier ?? "starter") as CompanyPlanTier;
    const enabledIds = company?.enabledApps ?? [];

    return {
      availableApps: getAvailableApps(planTier),
      enabledApps: getEnabledApps(planTier, enabledIds),
      planTier,
    };
  },
);

export { GLOBAL_PLATFORM_GROUP, GLOBAL_TOP_ITEMS };
