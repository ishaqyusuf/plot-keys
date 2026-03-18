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
 * Starter — free forever.
 * Includes: 1 template (starter tier), basic site builder, subdomain.
 */
export const starterPricing: PlanPricing = {
  annual: {
    formatted: "Free",
    interval: "annual",
    minorUnits: 0,
    monthlyEquivalentMinorUnits: 0,
  },
  annualDiscountPercent: 0,
  monthly: {
    formatted: "Free",
    interval: "monthly",
    minorUnits: 0,
    monthlyEquivalentMinorUnits: 0,
  },
  tier: "starter",
};

/**
 * Plus — ₦15,000/month or ₦144,000/year (20% off).
 * Includes: starter + plus templates, custom domain, estate management, WhatsApp.
 */
export const plusPricing: PlanPricing = {
  annual: {
    formatted: "₦144,000/yr",
    interval: "annual",
    minorUnits: 14_400_000, // 144,000 NGN × 100
    monthlyEquivalentMinorUnits: 1_200_000, // 12,000/month effective
  },
  annualDiscountPercent: 20,
  monthly: {
    formatted: "₦15,000/mo",
    interval: "monthly",
    minorUnits: 1_500_000, // 15,000 NGN × 100
    monthlyEquivalentMinorUnits: 1_500_000,
  },
  tier: "plus",
};

/**
 * Pro — ₦35,000/month or ₦336,000/year (20% off).
 * Includes: all templates, AI tools, payment integrations, priority support.
 */
export const proPricing: PlanPricing = {
  annual: {
    formatted: "₦336,000/yr",
    interval: "annual",
    minorUnits: 33_600_000, // 336,000 NGN × 100
    monthlyEquivalentMinorUnits: 2_800_000, // 28,000/month effective
  },
  annualDiscountPercent: 20,
  monthly: {
    formatted: "₦35,000/mo",
    interval: "monthly",
    minorUnits: 3_500_000, // 35,000 NGN × 100
    monthlyEquivalentMinorUnits: 3_500_000,
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
 * UPGRADE (e.g. Starter → Plus, Plus → Pro):
 *   - Effective immediately.
 *   - Bill the difference for the remaining period (prorated).
 *   - New plan-included template licenses granted immediately.
 *   - Billing provider ref stored in `billing_line_items.provider_ref`.
 *
 * DOWNGRADE (e.g. Pro → Plus, Plus → Starter):
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
  /** Days of grace after a payment fails before access is revoked. */
  gracePeriodDays: 7,
  /** Whether upgrades take effect immediately. */
  upgradeImmediate: true,
  /** Whether downgrades are effective at period end (not immediately). */
  downgradeAtPeriodEnd: true,
} as const;
