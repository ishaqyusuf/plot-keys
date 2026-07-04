"use client";

import type { AppRouter } from "@plotkeys/api/router";
import type { BillingInterval } from "@plotkeys/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { inferRouterOutputs } from "@trpc/server";

import { useTRPC } from "@/trpc/client";
import { BillingPageHeader } from "./table-header";
import {
  BillingHistoryTable,
  CurrentPlanCard,
  PlanComparison,
  RepairPaymentCard,
} from "./table";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type BillingInfo = RouterOutputs["workspace"]["getBillingInfo"];
type BillingPlanTier = "starter" | "plus" | "pro";
type BillingPlanStatus = "active" | "past_due" | "canceled";

type BillingTableProps = {
  selectedInterval: BillingInterval;
};

function resolvePlanTier(tier: BillingInfo["planTier"]): BillingPlanTier {
  return tier === "plus" || tier === "pro" ? tier : "starter";
}

function resolvePlanStatus(
  status: BillingInfo["planStatus"],
): BillingPlanStatus {
  if (status === "past_due" || status === "canceled") return status;

  return "active";
}

export function BillingTable({ selectedInterval }: BillingTableProps) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.workspace.getBillingInfo.queryOptions(),
  );
  const currentTier = resolvePlanTier(data.planTier);
  const currentStatus = resolvePlanStatus(data.planStatus);

  return (
    <div className="flex flex-col gap-5">
      <BillingPageHeader
        currentStatus={currentStatus}
        currentTier={currentTier}
        selectedInterval={selectedInterval}
      />
      <CurrentPlanCard
        currentStatus={currentStatus}
        currentTier={currentTier}
        planEndsAt={data.planEndsAt}
        planStartedAt={data.planStartedAt}
      />
      <PlanComparison
        currentTier={currentTier}
        selectedInterval={selectedInterval}
      />
      <RepairPaymentCard />
      <BillingHistoryTable items={data.recentItems} />
    </div>
  );
}
