/**
 * Plan sync job — runs after a billing provider webhook confirms a plan change.
 *
 * Trigger.dev boundary: this handler is the unit of work registered as
 * `plans.sync` in the Trigger.dev task catalog. It handles:
 *   1. Updating Company.planTier and Company.planStatus from the provider event
 *   2. Syncing plan-included template licenses (grant/revoke as needed)
 *   3. Recording the billing line item for the subscription change
 *
 * The workspace `changePlan` tRPC mutation mirrors this logic for manual
 * admin overrides. When Trigger.dev is integrated, billing webhooks should
 * enqueue this job instead of calling changePlan directly.
 */

export type PlanSyncPayload = {
  /** External billing provider subscription/event reference. */
  providerRef: string;
  /** Provider-reported plan tier key. */
  planTier: "starter" | "plus" | "pro";
  /** Provider-reported plan status. */
  planStatus: "active" | "past_due" | "canceled";
  /** Internal company identifier. */
  companyId: string;
};

export async function planSyncHandler(
  payload: PlanSyncPayload,
  _attempt: number,
): Promise<void> {
  const { createPrismaClient, syncPlanIncludedLicenses, updateCompanyPlan } =
    await import("@plotkeys/db");
  const { canAccessTemplateTier } = await import("@plotkeys/utils");
  const { templateCatalog } = await import("@plotkeys/section-registry");

  const { db } = createPrismaClient();
  if (!db) {
    throw new Error("[plan-sync] No database connection available.");
  }

  await updateCompanyPlan(db, payload.companyId, payload.planTier, payload.planStatus);

  const allowedKeys = templateCatalog
    .filter((t) => canAccessTemplateTier(payload.planTier, t.tier))
    .map((t) => t.key);

  await syncPlanIncludedLicenses(db, payload.companyId, allowedKeys);

  await db.billingLineItem.create({
    data: {
      amountMinorUnits: 0,
      companyId: payload.companyId,
      currency: "NGN",
      kind: "subscription",
      meta: { planTier: payload.planTier, providerRef: payload.providerRef },
      providerRef: payload.providerRef,
      status: payload.planStatus === "active" ? "active" : "cancelled",
    },
  }).catch(() => null); // Non-fatal — a duplicate may already exist
}
