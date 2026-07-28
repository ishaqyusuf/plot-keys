import "server-only";

import {
  type AppDefinition,
  type CompanyPlanTier,
  GLOBAL_PLATFORM_GROUP,
  GLOBAL_TOP_ITEMS,
  getAvailableApps,
  getEnabledApps,
} from "@plotkeys/app-store/registry";
import { cache } from "react";

import { getQueryClient, trpc } from "@/trpc/server";

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
    const queryClient = getQueryClient();
    const company = await queryClient.fetchQuery(trpc.apps.get.queryOptions());
    const planTier = company.planTier;
    const enabledIds = company.enabledIds;

    return {
      availableApps: getAvailableApps(planTier),
      enabledApps: getEnabledApps(planTier, enabledIds),
      planTier,
    };
  },
);

export { GLOBAL_PLATFORM_GROUP, GLOBAL_TOP_ITEMS };
