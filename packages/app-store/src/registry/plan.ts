import { APP_REGISTRY } from "./apps";
import type { AppDefinition, CompanyPlanTier } from "./types";

export const PLAN_RANK: Record<CompanyPlanTier, number> = {
  starter: 0,
  plus: 1,
  pro: 2,
};

export function isAppAvailable(
  app: AppDefinition,
  tier: CompanyPlanTier,
): boolean {
  return PLAN_RANK[tier] >= PLAN_RANK[app.planGate];
}

export function getAvailableApps(
  tier: CompanyPlanTier,
): readonly AppDefinition[] {
  return APP_REGISTRY.filter((app) => isAppAvailable(app, tier));
}

/**
 * Returns the apps that are both available on the tenant's plan AND flagged
 * as enabled by the tenant in `Company.enabledApps`.
 */
export function getEnabledApps(
  tier: CompanyPlanTier,
  enabledIds: readonly string[],
): readonly AppDefinition[] {
  const enabledSet = new Set(enabledIds);
  return getAvailableApps(tier).filter((app) => enabledSet.has(app.id));
}

export function isAppEnabled(
  appId: string,
  tier: CompanyPlanTier,
  enabledIds: readonly string[],
): boolean {
  return getEnabledApps(tier, enabledIds).some((app) => app.id === appId);
}
