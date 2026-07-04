"use client";

import type { AppRouter } from "@plotkeys/api/router";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type AiCreditInfo = RouterOutputs["workspace"]["getAiCreditInfo"];

export type AiCreditFeatureUsage = AiCreditInfo["byFeature"][number];
export type AiCreditUsageByFeature = AiCreditInfo["byFeature"];

function formatFeatureLabel(feature: string) {
  return feature.replaceAll("_", " ");
}

export function AiCreditFeatureCell({
  feature,
}: {
  feature: AiCreditFeatureUsage;
}) {
  return (
    <span className="font-medium text-sm capitalize">
      {formatFeatureLabel(feature.feature)}
    </span>
  );
}

export function AiCreditNumberCell({ value }: { value: number }) {
  return <span className="text-muted-foreground text-sm">{value}</span>;
}
