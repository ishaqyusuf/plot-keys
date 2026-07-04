"use client";

import { Card, CardContent } from "@plotkeys/ui/card";
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

import { purchaseAiCreditsAction } from "@/app/actions";
import {
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
} from "@/components/dashboard/dashboard-page";
import {
  AiCreditFeatureCell,
  AiCreditNumberCell,
  type AiCreditUsageByFeature,
} from "./columns";
import { AiCreditsUsageEmptyState } from "./empty-states";

export function AiCreditsTopUpCard() {
  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Top up credits</DashboardSectionTitle>
          <DashboardSectionDescription>
            Purchase a new block of credits to keep AI-assisted workflows
            available across the product.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <Card className="border-border/70 bg-card/82">
        <CardContent className="flex flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center">
          <p className="flex-1 text-sm leading-6 text-muted-foreground">
            Purchase a block of {aiCreditsBlockPrice.creditsPerBlock} credits to
            continue using AI features like Smart Fill. Credits never expire.
          </p>
          <form action={purchaseAiCreditsAction}>
            <SubmitButton loadingLabel="Purchasing...">
              Buy {aiCreditsBlockPrice.creditsPerBlock} Credits
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </DashboardSection>
  );
}

export function AiCreditsUsageTable({
  usage,
}: {
  usage: AiCreditUsageByFeature;
}) {
  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Usage by feature</DashboardSectionTitle>
          <DashboardSectionDescription>
            See which AI workflows are drawing the most credits right now.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>

      {usage.length === 0 ? (
        <AiCreditsUsageEmptyState />
      ) : (
        <div className="overflow-hidden rounded-[1.25rem] border border-border/65 bg-card/78">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="px-5 py-3">Feature</TableHead>
                <TableHead className="py-3 text-right">Credits</TableHead>
                <TableHead className="px-5 py-3 text-right">Calls</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usage.map((feature) => (
                <TableRow
                  className="border-border/50 hover:bg-muted/30"
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
    </DashboardSection>
  );
}
