"use client";

import type { BillingInterval } from "@plotkeys/utils";
import { useSuspenseQuery } from "@tanstack/react-query";

import { BillingHeader } from "@/components/billing/billing-header";
import {
  BillingHistoryTable,
  CurrentPlanCard,
  PlanComparison,
  RepairPaymentCard,
} from "@/components/billing/billing-sections";
import {
  resolveBillingPlanStatus,
  resolveBillingPlanTier,
} from "@/components/billing/billing-utils";
import { useTRPC } from "@/trpc/client";

type Props = {
  selectedInterval: BillingInterval;
};

export function BillingContent({ selectedInterval }: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.billing.getInfo.queryOptions());
  const currentTier = resolveBillingPlanTier(data.planTier);
  const currentStatus = resolveBillingPlanStatus(data.planStatus);

  return (
    <div className="flex flex-col gap-5">
      <BillingHeader
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
