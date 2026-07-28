"use client";

import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@plotkeys/ui/table";
import { aiCreditsBlockPrice } from "@plotkeys/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AiCreditsUsageEmptyState } from "@/components/ai-credits/ai-credits-empty-states";
import { AiCreditsSection } from "@/components/ai-credits/ai-credits-section";
import {
  AiCreditFeatureCell,
  AiCreditNumberCell,
  type AiCreditUsageByFeature,
} from "@/components/ai-credits/ai-credits-table-cells";
import { useTRPC } from "@/trpc/client";

export function AiCreditsTopUpCard() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const purchaseCreditsMutation = useMutation(
    trpc.aiCredits.purchase.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries({
          queryKey: trpc.aiCredits.get.queryKey(),
        });
      },
    }),
  );

  return (
    <AiCreditsSection
      description="Purchase a new block of credits to keep AI-assisted workflows available across the product."
      title="Top up credits"
    >
      <div className="border bg-background p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <p className="flex-1 text-sm leading-6 text-muted-foreground">
            Purchase a block of {aiCreditsBlockPrice.creditsPerBlock} credits to
            continue using AI features like Smart Fill. Credits never expire.
          </p>
          <div className="flex flex-col items-start gap-2 lg:items-end">
            <SubmitButton
              isSubmitting={purchaseCreditsMutation.isPending}
              onClick={() => purchaseCreditsMutation.mutate()}
              type="button"
            >
              Buy {aiCreditsBlockPrice.creditsPerBlock} Credits
            </SubmitButton>
            {purchaseCreditsMutation.error ? (
              <Alert variant="destructive">
                <AlertDescription>
                  {purchaseCreditsMutation.error.message ||
                    "Unable to purchase credits."}
                </AlertDescription>
              </Alert>
            ) : null}
          </div>
        </div>
      </div>
    </AiCreditsSection>
  );
}

export function AiCreditsUsageTable({
  usage,
}: {
  usage: AiCreditUsageByFeature;
}) {
  return (
    <AiCreditsSection
      description="See which AI workflows are drawing the most credits right now."
      title="Usage by feature"
    >
      {usage.length === 0 ? (
        <AiCreditsUsageEmptyState />
      ) : (
        <div className="overflow-hidden border bg-background">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="px-5 py-3">Feature</TableHead>
                <TableHead className="py-3 text-right">Credits</TableHead>
                <TableHead className="px-5 py-3 text-right">Calls</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usage.map((feature) => (
                <TableRow
                  className="border-border hover:bg-muted"
                  key={feature.feature}
                >
                  <TableCell className="px-5 py-3">
                    <AiCreditFeatureCell feature={feature} />
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <AiCreditNumberCell value={feature.creditsUsed} />
                  </TableCell>
                  <TableCell className="px-5 py-3 text-right">
                    <AiCreditNumberCell value={feature.count} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AiCreditsSection>
  );
}
