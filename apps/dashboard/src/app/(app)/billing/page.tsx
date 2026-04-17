import { createPrismaClient, findCompanyById } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import {
  type BillingInterval,
  getPlanPricing,
  planTrialDays,
  tierLabels,
} from "@plotkeys/utils";
import { CreditCard } from "lucide-react";
import { redirect } from "next/navigation";

import { DashboardEmptyState } from "../../../components/dashboard/dashboard-empty-state";
import {
  DashboardFilterTab,
  DashboardFilterTabs,
  DashboardPage,
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardPageToolbar,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
  DashboardToolbarGroup,
} from "../../../components/dashboard/dashboard-page";
import { requireOnboardedSession } from "../../../lib/session";
import { initializeCheckoutAction } from "../../actions";

type BillingPageProps = {
  searchParams?: Promise<{ interval?: string; success?: string }>;
};

const tierFeatures: Record<string, string[]> = {
  plus: [
    "Everything in Launch",
    "Custom domain",
    "Up to 8 team seats",
    "WhatsApp integration",
    "Customer accounts",
    "Light AI allocation",
  ],
  pro: [
    "Everything in Growth",
    "All premium templates",
    "Higher AI allocation",
    "Advanced branding controls",
    "Priority support",
  ],
  starter: [
    "1 live website",
    "Starter templates",
    "Subdomain hosting",
    "Lead capture",
    "Up to 2 team seats",
  ],
};

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const params = (await searchParams) ?? {};
  const session = await requireOnboardedSession();
  const prisma = createPrismaClient().db;

  const company = prisma
    ? await findCompanyById(prisma, session.activeMembership.companyId)
    : null;

  if (!company) redirect("/");

  const currentTier = (company.planTier ?? "starter") as
    | "starter"
    | "plus"
    | "pro";
  const currentStatus = company.planStatus ?? "active";
  const selectedInterval: BillingInterval =
    params.interval === "annual" ? "annual" : "monthly";

  const recentItems = prisma
    ? await prisma.billingLineItem.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        where: { companyId: company.id },
      })
    : [];

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Revenue workspace</DashboardPageEyebrow>
            <DashboardPageTitle>Billing &amp; plans</DashboardPageTitle>
            <DashboardPageDescription>
              Manage your subscription, compare plan levels, and review billing
              history. Every plan includes a {planTrialDays}-day free trial.
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <Badge
              variant={currentStatus === "active" ? "default" : "secondary"}
            >
              {currentStatus === "active"
                ? "Active"
                : currentStatus === "past_due"
                  ? "Past due"
                  : "Canceled"}
            </Badge>
          </DashboardPageActions>
        </DashboardPageHeaderRow>
        <DashboardPageToolbar>
          <DashboardToolbarGroup className="text-sm text-muted-foreground">
            Current plan: {tierLabels[currentTier]}
          </DashboardToolbarGroup>
          <DashboardToolbarGroup>
            <DashboardFilterTabs>
              <DashboardFilterTab
                active={selectedInterval === "monthly"}
                href="/billing?interval=monthly"
              >
                Monthly
              </DashboardFilterTab>
              <DashboardFilterTab
                active={selectedInterval === "annual"}
                href="/billing?interval=annual"
              >
                Annual
              </DashboardFilterTab>
            </DashboardFilterTabs>
            <Badge variant="secondary">Save 20%</Badge>
          </DashboardToolbarGroup>
        </DashboardPageToolbar>
      </DashboardPageHeader>

      {params.success === "1" && (
        <Card className="border-green-300/60 bg-green-50/35 dark:border-green-900/70 dark:bg-green-950/15">
          <CardContent className="py-4">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✓ Payment successful! Your plan has been updated.
            </p>
          </CardContent>
        </Card>
      )}

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Current plan</DashboardSectionTitle>
            <DashboardSectionDescription>
              Review current status, start date, and the active plan before
              making changes.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <Card className="border-border/65 bg-card/78">
          <CardHeader>
            <CardTitle className="text-lg">Current Plan</CardTitle>
            <CardDescription>
              You are on the <strong>{tierLabels[currentTier]}</strong> plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Badge
              variant={currentStatus === "active" ? "default" : "secondary"}
            >
              {currentStatus === "active"
                ? "Active"
                : currentStatus === "past_due"
                  ? "Past due"
                  : "Canceled"}
            </Badge>
            {company.planStartedAt && (
              <span className="text-xs text-muted-foreground">
                Since{" "}
                {new Intl.DateTimeFormat("en-NG", {
                  dateStyle: "medium",
                }).format(company.planStartedAt)}
              </span>
            )}
            {company.planEndsAt && (
              <span className="text-xs text-muted-foreground">
                · Ends{" "}
                {new Intl.DateTimeFormat("en-NG", {
                  dateStyle: "medium",
                }).format(company.planEndsAt)}
              </span>
            )}
          </CardContent>
        </Card>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Available plans</DashboardSectionTitle>
            <DashboardSectionDescription>
              Compare tiers and upgrade into higher usage limits or premium
              features.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <div className="grid gap-2.5 md:grid-cols-3">
          {(["starter", "plus", "pro"] as const).map((tier) => {
            const pricing = getPlanPricing(tier);
            const price =
              selectedInterval === "monthly" ? pricing.monthly : pricing.annual;
            const isCurrent = tier === currentTier;
            const isUpgrade =
              ["starter", "plus", "pro"].indexOf(tier) >
              ["starter", "plus", "pro"].indexOf(currentTier);

            return (
              <Card
                key={tier}
                className={
                  isCurrent
                    ? "border-2 border-primary/40 bg-card/80"
                    : "border-border/65 bg-card/78"
                }
              >
                <CardHeader>
                  <CardTitle>{tierLabels[tier]}</CardTitle>
                  <CardDescription>
                    <span className="text-2xl font-bold text-foreground">
                      {price.formatted}
                    </span>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {pricing.annual.minorUnits === 0
                        ? `${planTrialDays}-day free trial`
                        : `${planTrialDays}-day free trial · ${pricing.annual.formatted} billed annually`}
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
                    {(tierFeatures[tier] ?? []).map((feature) => (
                      <li key={feature}>✓ {feature}</li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <Button disabled variant="outline" className="w-full">
                      Current plan
                    </Button>
                  ) : isUpgrade ? (
                    <form action={initializeCheckoutAction}>
                      <input type="hidden" name="planTier" value={tier} />
                      <input
                        type="hidden"
                        name="interval"
                        value={selectedInterval}
                      />
                      <Button type="submit" className="w-full">
                        Upgrade to {tierLabels[tier]}
                      </Button>
                    </form>
                  ) : (
                    <Button disabled variant="outline" className="w-full">
                      Contact support
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Billing history</DashboardSectionTitle>
            <DashboardSectionDescription>
              Recent billing line items and invoice activity for this workspace.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>

        {recentItems.length === 0 ? (
          <DashboardEmptyState
            description="No billing records yet."
            icon={<CreditCard className="size-5" />}
            title="No billing history"
          />
        ) : (
          <div className="space-y-2">
            {recentItems.map((item) => (
              <Card key={item.id} className="border-border/70 bg-card/82">
                <CardContent className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {item.kind.replace("_", " ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("en-NG", {
                        dateStyle: "medium",
                      }).format(item.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      ₦{(item.amountMinorUnits / 100).toLocaleString("en-NG")}
                    </span>
                    <Badge
                      variant={
                        item.status === "active"
                          ? "default"
                          : item.status === "pending"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DashboardSection>
    </DashboardPage>
  );
}
