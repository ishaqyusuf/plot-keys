import {
  createPrismaClient,
  getAiCreditBalance,
  getAiUsageStats,
} from "@plotkeys/db";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { Bot, Sparkles, Wallet } from "lucide-react";
import {
  DashboardPage,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
  DashboardStatGrid,
} from "../../../components/dashboard/dashboard-page";
import { requireOnboardedSession } from "../../../lib/session";
import { purchaseAiCreditsAction } from "../../actions";

export default async function AiCreditsPage() {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const prisma = createPrismaClient().db;
  if (!prisma) throw new Error("Database not configured.");

  const [balance, usage] = await Promise.all([
    getAiCreditBalance(prisma, companyId),
    getAiUsageStats(prisma, companyId),
  ]);

  const totalCalls = usage.byFeature.reduce(
    (sum: number, feature: { count: number }) => sum + feature.count,
    0,
  );

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>AI workspace</DashboardPageEyebrow>
            <DashboardPageTitle>AI Credits</DashboardPageTitle>
            <DashboardPageDescription>
              Manage your credit balance and review feature consumption without
              leaving the shared dashboard rhythm.
            </DashboardPageDescription>
          </DashboardPageIntro>
        </DashboardPageHeaderRow>
      </DashboardPageHeader>

      <DashboardStatGrid className="xl:grid-cols-3">
        {[
          {
            icon: Wallet,
            label: "Credit balance",
            value: balance,
            suffix: "available",
          },
          {
            icon: Sparkles,
            label: "Used in 30 days",
            value: usage.totalCreditsUsed,
            suffix: "credits consumed",
          },
          {
            icon: Bot,
            label: "AI calls",
            value: totalCalls,
            suffix: "requests processed",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/70 bg-card/82">
            <CardContent className="flex items-center gap-4 px-5 py-5">
              <div className="rounded-full border border-border/70 bg-background/80 p-3">
                <stat.icon className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.suffix}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </DashboardStatGrid>

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
              Purchase a block of 100 credits to continue using AI features like
              Smart Fill. Credits never expire.
            </p>
            <form action={purchaseAiCreditsAction}>
              <SubmitButton loadingLabel="Purchasing…">
                Buy 100 Credits
              </SubmitButton>
            </form>
          </CardContent>
        </Card>
      </DashboardSection>

      {usage.byFeature.length > 0 ? (
        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Usage by feature</DashboardSectionTitle>
              <DashboardSectionDescription>
                See which AI workflows are drawing the most credits right now.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>
          <Card className="border-border/70 bg-card/82">
            <CardHeader>
              <CardTitle>Consumption breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {usage.byFeature.map(
                (feature: {
                  feature: string;
                  count: number;
                  creditsUsed: number;
                }) => (
                  <div
                    key={feature.feature}
                    className="flex items-center justify-between gap-4 rounded-[calc(var(--radius-lg)+0.125rem)] border border-border/60 bg-background/55 px-4 py-3"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {feature.feature}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {feature.creditsUsed} credits / {feature.count} calls
                    </span>
                  </div>
                ),
              )}
            </CardContent>
          </Card>
        </DashboardSection>
      ) : null}
    </DashboardPage>
  );
}
