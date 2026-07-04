import {
  type AppDefinition,
  type CompanyPlanTier,
  GLOBAL_PLATFORM_GROUP,
  GLOBAL_TOP_ITEMS,
  getAvailableApps,
  getEnabledApps,
} from "@plotkeys/app-store/registry";
import {
  getCompanyAppsState as getCompanyAppsStateQuery,
  setCompanyEnabledAppIds as setCompanyEnabledAppIdsQuery,
} from "@plotkeys/db/queries";
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

export async function getCompanyAppsState(
  companyId: string,
): Promise<CompanyAppsState | null> {
  const result = await getCompanyAppsStateQuery(companyId);
  return result.ok ? result.data : null;
}

export async function setCompanyEnabledAppIds(
  companyId: string,
  enabledIds: readonly string[],
): Promise<void> {
  const result = await setCompanyEnabledAppIdsQuery({ companyId, enabledIds });

  if (!result.ok) {
    throw new Error("Database unavailable.");
  }
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
