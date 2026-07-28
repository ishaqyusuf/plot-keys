import type { AppRouter } from "@plotkeys/api/router";
import {
  type BillingInterval,
  type SubscriptionTier,
  subscriptionTiers,
} from "@plotkeys/utils";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type BillingInfo = RouterOutputs["billing"]["getInfo"];

export type BillingPlanTier = "starter" | "plus" | "pro";
export type BillingPlanStatus = "active" | "past_due" | "canceled";

export function resolveBillingInterval(interval?: string): BillingInterval {
  return interval === "annual" ? "annual" : "monthly";
}

export function isBillingSubscriptionTier(
  value: string,
): value is SubscriptionTier {
  return subscriptionTiers.includes(value as SubscriptionTier);
}

export function resolveBillingPlanTier(
  tier: BillingInfo["planTier"],
): BillingPlanTier {
  return tier === "plus" || tier === "pro" ? tier : "starter";
}

export function resolveBillingPlanStatus(
  status: BillingInfo["planStatus"],
): BillingPlanStatus {
  if (status === "past_due" || status === "canceled") return status;

  return "active";
}
