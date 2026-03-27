export const subscriptionTiers = ["starter", "plus", "pro"] as const;

export type SubscriptionTier = (typeof subscriptionTiers)[number];

export const subscriptionPlanStatuses = [
  "active",
  "past_due",
  "canceled",
] as const;

export type SubscriptionPlanStatus = (typeof subscriptionPlanStatuses)[number];

export const templateTiers = ["starter", "plus", "pro"] as const;

export type TemplateTier = (typeof templateTiers)[number];

export const tierLabels: Record<SubscriptionTier, string> = {
  plus: "Growth",
  pro: "Scale",
  starter: "Launch",
};

export const templateTierLabels: Record<TemplateTier, string> = {
  plus: "Growth",
  pro: "Scale",
  starter: "Launch",
};

export type PlanFeatureKey =
  | "aiTools"
  | "customerAccounts"
  | "customDomains"
  | "estateManagement"
  | "websitePayments";

type PlanEntitlements = {
  features: Record<PlanFeatureKey, boolean>;
  planTier: SubscriptionTier;
};

const tierRank: Record<SubscriptionTier, number> = {
  plus: 1,
  pro: 2,
  starter: 0,
};

const templateTierMinimumPlan: Record<TemplateTier, SubscriptionTier> = {
  plus: "plus",
  pro: "pro",
  starter: "starter",
};

export function isPlanAtLeast(
  planTier: SubscriptionTier,
  minimumTier: SubscriptionTier,
) {
  return tierRank[planTier] >= tierRank[minimumTier];
}

export function resolvePlanEntitlements(
  planTier: SubscriptionTier,
): PlanEntitlements {
  return {
    features: {
      aiTools: planTier === "pro",
      customerAccounts: isPlanAtLeast(planTier, "plus"),
      customDomains: isPlanAtLeast(planTier, "plus"),
      estateManagement: isPlanAtLeast(planTier, "plus"),
      websitePayments: isPlanAtLeast(planTier, "plus"),
    },
    planTier,
  };
}

export function canAccessTemplateTier(
  planTier: SubscriptionTier,
  templateTier: TemplateTier,
) {
  return isPlanAtLeast(planTier, templateTierMinimumPlan[templateTier]);
}

export function describeTemplateAccess(
  planTier: SubscriptionTier,
  templateTier: TemplateTier,
) {
  if (canAccessTemplateTier(planTier, templateTier)) {
    return {
      allowed: true,
      ctaLabel: "Open as draft",
      message:
        templateTier === "starter"
          ? "Included on every plan."
          : `Included on ${tierLabels[planTier]} while this tier is active.`,
      requiredTier: templateTierMinimumPlan[templateTier],
    };
  }

  const requiredTier = templateTierMinimumPlan[templateTier];

  return {
    allowed: false,
    ctaLabel: `Upgrade to ${tierLabels[requiredTier]}`,
    message: `${templateTierLabels[templateTier]} templates require the ${tierLabels[requiredTier]} plan.`,
    requiredTier,
  };
}
