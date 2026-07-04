"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { AiCreditsSummary } from "./summary";
import { AiCreditsTopUpCard, AiCreditsUsageTable } from "./table";
import { AiCreditsPageHeader } from "./table-header";

export function AiCreditsTable() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.workspace.getAiCreditInfo.queryOptions(),
  );
  const totalCalls = data.byFeature.reduce(
    (sum, feature) => sum + feature.count,
    0,
  );

  return (
    <div className="flex flex-col gap-5">
      <AiCreditsPageHeader />
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
