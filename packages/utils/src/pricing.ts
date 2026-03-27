/**
 * Platform pricing configuration.
 *
 * All amounts are in Nigerian Naira (NGN) minor units (kobo).
 * 1 NGN = 100 kobo, so ₦5,000 = 500_000 kobo.
 *
 * Billing intervals are in calendar months.
 * Upgrade/downgrade rules are documented inline.
 */

import type { SubscriptionTier } from "./tiers";

export type BillingInterval = "monthly" | "annual";
export const planTrialDays = 14;

export type PlanPrice = {
  /** Human-readable formatted price string. */
  formatted: string;
  /** Amount in NGN minor units (kobo). */
  minorUnits: number;
  /** Billing interval. */
  interval: BillingInterval;
  /** Effective monthly cost in kobo (for comparison display). */
  monthlyEquivalentMinorUnits: number;
};

export type PlanPricing = {
  annual: PlanPrice;
  monthly: PlanPrice;
  /** Discount percentage off monthly price when paying annually. */
  annualDiscountPercent: number;
  tier: SubscriptionTier;
};

// ---------------------------------------------------------------------------
// Plan prices
// ---------------------------------------------------------------------------

/**
 * Launch (internal tier: starter) — paid entry tier.
 * Includes: 1 live website, starter-tier templates, core listing/leads flow.
 */
export const starterPricing: PlanPricing = {
  annual: {
    formatted: "₦192,000/yr",
    interval: "annual",
    minorUnits: 19_200_000, // 192,000 NGN × 100
    monthlyEquivalentMinorUnits: 1_600_000, // 16,000/month effective
  },
  annualDiscountPercent: 20,
  monthly: {
    formatted: "₦20,000/mo",
    interval: "monthly",
    minorUnits: 2_000_000, // 20,000 NGN × 100
    monthlyEquivalentMinorUnits: 2_000_000,
  },
  tier: "starter",
};

/**
 * Growth (internal tier: plus) — recommended operating tier.
 * Includes: launch + custom domain, stronger operations, light AI allowance.
 */
export const plusPricing: PlanPricing = {
  annual: {
    formatted: "₦432,000/yr",
    interval: "annual",
    minorUnits: 43_200_000, // 432,000 NGN × 100
    monthlyEquivalentMinorUnits: 3_600_000, // 36,000/month effective
  },
  annualDiscountPercent: 20,
  monthly: {
    formatted: "₦45,000/mo",
    interval: "monthly",
    minorUnits: 4_500_000, // 45,000 NGN × 100
    monthlyEquivalentMinorUnits: 4_500_000,
  },
  tier: "plus",
};

/**
 * Scale (internal tier: pro) — premium operating layer.
 * Includes: growth + all templates, larger AI allocation, priority support.
 */
export const proPricing: PlanPricing = {
  annual: {
    formatted: "₦864,000/yr",
    interval: "annual",
    minorUnits: 86_400_000, // 864,000 NGN × 100
    monthlyEquivalentMinorUnits: 7_200_000, // 72,000/month effective
  },
  annualDiscountPercent: 20,
  monthly: {
    formatted: "₦90,000/mo",
    interval: "monthly",
    minorUnits: 9_000_000, // 90,000 NGN × 100
    monthlyEquivalentMinorUnits: 9_000_000,
  },
  tier: "pro",
};

/** Template purchase — one-time unlock of a premium template. */
export const templatePurchasePrice = {
  formatted: "₦25,000",
  minorUnits: 2_500_000,
};

/** Stock image license — per-image one-time fee. */
export const stockImagePrice = {
  formatted: "₦2,500",
  minorUnits: 250_000,
};

/** Domain addon — annual fee for a custom domain hosted on the platform. */
export const domainAddonPrice = {
  annual: {
    formatted: "₦10,000/yr",
    minorUnits: 1_000_000,
  },
};

/** AI credits top-up — block of 100 AI generation credits. */
export const aiCreditsBlockPrice = {
  creditsPerBlock: 100,
  formatted: "₦5,000",
  minorUnits: 500_000,
};

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export const planPricingByTier: Record<SubscriptionTier, PlanPricing> = {
  plus: plusPricing,
  pro: proPricing,
  starter: starterPricing,
};

export function getPlanPricing(tier: SubscriptionTier): PlanPricing {
  return planPricingByTier[tier];
}

// ---------------------------------------------------------------------------
// Upgrade/downgrade rules
// ---------------------------------------------------------------------------

/**
 * Prorated credit rules (for future billing provider integration):
 *
 * UPGRADE (e.g. Launch → Growth, Growth → Scale):
 *   - Effective immediately.
 *   - Bill the difference for the remaining period (prorated).
 *   - New plan-included template licenses granted immediately.
 *   - Billing provider ref stored in `billing_line_items.provider_ref`.
 *
 * DOWNGRADE (e.g. Scale → Growth, Growth → Launch):
 *   - Effective at the end of the current billing period (no refund).
 *   - Access to higher-tier templates retained until period end.
 *   - After period end: `changePlan` job runs, revokes higher-tier
 *     plan_included licenses, and records the new tier.
 *   - Purchased template licenses are NOT revoked on downgrade (user
 *     paid for them individually).
 *
 * CANCELLATION:
 *   - Effective at period end.
 *   - Company.planStatus → "canceled" after period end.
 *   - All plan_included licenses revoked; free picks and purchased
 *     licenses retained.
 *
 * PAST_DUE:
 *   - Access continues for a 7-day grace period.
 *   - After grace period: Company.planStatus → "canceled" via billing
 *     webhook and the plan sync job.
 */
export const billingRules = {
  /** Days in the default free trial window for new subscriptions. */
  trialDays: planTrialDays,
  /** Days of grace after a payment fails before access is revoked. */
  gracePeriodDays: 7,
  /** Whether upgrades take effect immediately. */
  upgradeImmediate: true,
  /** Whether downgrades are effective at period end (not immediately). */
  downgradeAtPeriodEnd: true,
} as const;
