"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@plotkeys/ui/table";
import type { BillingInterval } from "@plotkeys/utils";
import { getPlanPricing, planTrialDays, tierLabels } from "@plotkeys/utils";
import { Check, RotateCcw } from "lucide-react";

import {
  initializeCheckoutAction,
  repairBillingPaymentAction,
} from "@/app/actions";
import {
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
} from "@/components/dashboard/dashboard-page";
import {
  BillingAmountCell,
  BillingDateCell,
  BillingItemCell,
  type BillingLineItem,
  BillingReferenceCell,
  BillingStatusCell,
} from "./columns";
import { BillingHistoryEmptyState } from "./empty-states";

type BillingPlanTier = "starter" | "plus" | "pro";
type BillingPlanStatus = "active" | "past_due" | "canceled";

const tierFeatures: Record<BillingPlanTier, string[]> = {
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

const statusLabels: Record<BillingPlanStatus, string> = {
  active: "Active",
  canceled: "Canceled",
  past_due: "Past due",
};

function formatDate(date: Date | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(date);
}

export function CurrentPlanCard({
  currentStatus,
  currentTier,
  planEndsAt,
  planStartedAt,
}: {
  currentStatus: BillingPlanStatus;
  currentTier: BillingPlanTier;
  planEndsAt: Date | null;
  planStartedAt: Date | null;
}) {
  const planStartLabel = formatDate(planStartedAt);
  const planEndLabel = formatDate(planEndsAt);

  return (
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
        <CardHeader className="px-5 py-4">
          <CardTitle className="text-base">Current Plan</CardTitle>
          <CardDescription>
            You are on the <strong>{tierLabels[currentTier]}</strong> plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4 px-5 pb-5 pt-0">
          <Badge
            variant={currentStatus === "active" ? "default" : "secondary"}
          >
            {statusLabels[currentStatus]}
          </Badge>
          {planStartLabel ? (
            <span className="text-xs text-muted-foreground">
              Since {planStartLabel}
            </span>
          ) : null}
          {planEndLabel ? (
            <span className="text-xs text-muted-foreground">
              Ends {planEndLabel}
            </span>
          ) : null}
        </CardContent>
      </Card>
    </DashboardSection>
  );
}

export function PlanComparison({
  currentTier,
  selectedInterval,
}: {
  currentTier: BillingPlanTier;
  selectedInterval: BillingInterval;
}) {
  return (
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
              <CardHeader className="px-5 py-4">
                <CardTitle className="text-base">{tierLabels[tier]}</CardTitle>
                <CardDescription>
                  <span className="text-2xl font-bold text-foreground">
                    {price.formatted}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {pricing.annual.minorUnits === 0
                      ? `${planTrialDays}-day free trial`
                      : `${planTrialDays}-day free trial; ${pricing.annual.formatted} billed annually`}
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0">
                <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
                  {tierFeatures[tier].map((feature) => (
                    <li className="flex items-start gap-2" key={feature}>
                      <Check className="mt-0.5 size-3.5 flex-none text-primary" />
                      <span>{feature}</span>
                    </li>
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
  );
}

export function RepairPaymentCard() {
  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Repair payment</DashboardSectionTitle>
          <DashboardSectionDescription>
            Confirm a successful Paystack payment that did not upgrade this
            workspace.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <Card className="border-border/65 bg-card/78">
        <CardContent className="px-5 py-4">
          <form
            action={repairBillingPaymentAction}
            className="grid gap-3 md:grid-cols-[1fr_auto]"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="paystack-reference">
                  Paystack reference
                </FieldLabel>
                <Input
                  id="paystack-reference"
                  name="reference"
                  placeholder="e.g. T1234567890"
                  required
                />
              </Field>
            </FieldGroup>
            <div className="flex items-end">
              <Button type="submit" variant="outline">
                <RotateCcw className="mr-1.5 size-3.5" />
                Repair payment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardSection>
  );
}

export function BillingHistoryTable({ items }: { items: BillingLineItem[] }) {
  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Billing history</DashboardSectionTitle>
          <DashboardSectionDescription>
            Recent billing line items and invoice activity for this workspace.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>

      {items.length === 0 ? (
        <BillingHistoryEmptyState />
      ) : (
        <div className="overflow-hidden rounded-[1.25rem] border border-border/65 bg-card/78">
          <div className="overflow-x-auto">
            <Table className="min-w-[46rem]">
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="px-5 py-3">Item</TableHead>
                  <TableHead className="py-3">Date</TableHead>
                  <TableHead className="py-3">Reference</TableHead>
                  <TableHead className="py-3 text-right">Amount</TableHead>
                  <TableHead className="px-5 py-3 text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow
                    className="border-border/50 hover:bg-muted/30"
                    key={item.id}
                  >
                    <TableCell className="px-5 py-3">
                      <BillingItemCell item={item} />
                    </TableCell>
                    <TableCell className="py-3">
                      <BillingDateCell date={item.createdAt} />
                    </TableCell>
                    <TableCell className="py-3">
                      <BillingReferenceCell providerRef={item.providerRef} />
                    </TableCell>
                    <TableCell className="py-3 text-right text-sm font-medium">
                      <BillingAmountCell
                        amount={item.amount}
                        currency={item.currency}
                      />
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <BillingStatusCell item={item} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </DashboardSection>
  );
}
