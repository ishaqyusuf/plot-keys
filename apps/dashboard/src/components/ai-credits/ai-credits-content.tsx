"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { AiCreditsHeader } from "@/components/ai-credits/ai-credits-header";
import {
  AiCreditsTopUpCard,
  AiCreditsUsageTable,
} from "@/components/ai-credits/ai-credits-sections";
import { AiCreditsSummary } from "@/components/ai-credits/ai-credits-summary";
import { useTRPC } from "@/trpc/client";

export function AiCreditsContent() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.aiCredits.get.queryOptions());
  const totalCalls = data.byFeature.reduce(
    (sum, feature) => sum + feature.count,
    0,
  );

  return (
    <div className="flex flex-col gap-5">
      <AiCreditsHeader />
      <AiCreditsSummary
        balance={data.balance}
        totalCalls={totalCalls}
        totalCreditsUsed={data.totalCreditsUsed}
      />
      <AiCreditsTopUpCard />
      <AiCreditsUsageTable usage={data.byFeature} />
    </div>
  );
}
