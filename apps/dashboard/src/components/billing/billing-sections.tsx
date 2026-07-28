"use client";

import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Icon } from "@plotkeys/ui/icons";
import { Input } from "@plotkeys/ui/input";
import { SubmitButton } from "@plotkeys/ui/submit-button";
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
import { useMutation } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import { BillingHistoryEmptyState } from "@/components/billing/billing-empty-states";
import { BillingSection } from "@/components/billing/billing-section";
import {
  BillingAmountCell,
  BillingDateCell,
  BillingItemCell,
  type BillingLineItem,
  BillingReferenceCell,
  BillingStatusCell,
} from "@/components/billing/billing-table-cells";
import type {
  BillingPlanStatus,
  BillingPlanTier,
} from "@/components/billing/billing-utils";
import { useTRPC } from "@/trpc/client";

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
    <BillingSection
      description="Review current status, start date, and the active plan before making changes."
      title="Current plan"
    >
      <div className="flex flex-col gap-4 border bg-background p-5">
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Current plan</p>
            <p className="text-lg font-medium">{tierLabels[currentTier]}</p>
          </div>
          <div className="mt-auto">
            <Badge
              variant={currentStatus === "active" ? "default" : "secondary"}
            >
              {statusLabels[currentStatus]}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          {planStartLabel ? <span>Since {planStartLabel}</span> : null}
          {planEndLabel ? <span>Ends {planEndLabel}</span> : null}
        </div>
      </div>
    </BillingSection>
  );
}

export function PlanComparison({
  currentTier,
  selectedInterval,
}: {
  currentTier: BillingPlanTier;
  selectedInterval: BillingInterval;
}) {
  const trpc = useTRPC();
  const [checkoutTier, setCheckoutTier] = useState<"plus" | "pro" | null>(null);
  const initializeCheckoutMutation = useMutation(
    trpc.billing.initializeCheckout.mutationOptions({
      onSuccess(result) {
        window.location.assign(result.authorizationUrl);
      },
    }),
  );

  return (
    <BillingSection
      description="Compare tiers and upgrade into higher usage limits or premium features."
      title="Available plans"
    >
      <div className="grid gap-2.5 md:grid-cols-3">
        {(["starter", "plus", "pro"] as const).map((tier) => {
          const pricing = getPlanPricing(tier);
          const price =
            selectedInterval === "monthly" ? pricing.monthly : pricing.annual;
          const isCurrent = tier === currentTier;
          const isUpgrade =
            ["starter", "plus", "pro"].indexOf(tier) >
            ["starter", "plus", "pro"].indexOf(currentTier);
          const paidTier = tier === "starter" ? null : tier;

          return (
            <div
              className={
                isCurrent
                  ? "border-2 border-primary/40 bg-background p-5"
                  : "border bg-background p-5"
              }
              key={tier}
            >
              <div className="mb-4">
                <p className="text-base font-medium">{tierLabels[tier]}</p>
                <p className="mt-3 text-2xl font-bold text-foreground">
                  {price.formatted}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {pricing.annual.minorUnits === 0
                    ? `${planTrialDays}-day free trial`
                    : `${planTrialDays}-day free trial; ${pricing.annual.formatted} billed annually`}
                </p>
              </div>
              <div>
                <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
                  {tierFeatures[tier].map((feature) => (
                    <li className="flex items-start gap-2" key={feature}>
                      <Icon.Check className="mt-0.5 size-3.5 flex-none text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current plan
                  </Button>
                ) : isUpgrade && paidTier ? (
                  <div className="space-y-2">
                    <SubmitButton
                      isSubmitting={initializeCheckoutMutation.isPending}
                      className="w-full"
                      onClick={() => {
                        setCheckoutTier(paidTier);
                        initializeCheckoutMutation.mutate({
                          callbackUrl: `${window.location.origin}/billing/callback`,
                          interval: selectedInterval,
                          planTier: paidTier,
                        });
                      }}
                      type="button"
                    >
                      Upgrade to {tierLabels[tier]}
                    </SubmitButton>
                    {checkoutTier === paidTier &&
                    initializeCheckoutMutation.error ? (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {initializeCheckoutMutation.error.message ||
                            "Unable to start checkout."}
                        </AlertDescription>
                      </Alert>
                    ) : null}
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Contact support
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </BillingSection>
  );
}

export function RepairPaymentCard() {
  const [reference, setReference] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedReference = reference.trim();

    if (!trimmedReference) {
      return;
    }

    window.location.assign(
      `/billing/callback?reference=${encodeURIComponent(trimmedReference)}`,
    );
  }

  return (
    <BillingSection
      description="Confirm a successful Paystack payment that did not upgrade this workspace."
      title="Repair payment"
    >
      <div className="border bg-background p-5">
        <form
          className="grid gap-3 md:grid-cols-[1fr_auto]"
          onSubmit={handleSubmit}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="paystack-reference">
                Paystack reference
              </FieldLabel>
              <Input
                id="paystack-reference"
                onChange={(event) => setReference(event.currentTarget.value)}
                placeholder="e.g. T1234567890"
                required
                value={reference}
              />
            </Field>
          </FieldGroup>
          <div className="flex items-end">
            <SubmitButton isSubmitting={false} variant="outline">
              <Icon.RefreshCcw className="mr-1.5 size-3.5" />
              Repair payment
            </SubmitButton>
          </div>
        </form>
      </div>
    </BillingSection>
  );
}

export function BillingHistoryTable({ items }: { items: BillingLineItem[] }) {
  return (
    <BillingSection
      description="Recent billing line items and invoice activity for this workspace."
      title="Billing history"
    >
      {items.length === 0 ? (
        <BillingHistoryEmptyState />
      ) : (
        <div className="overflow-hidden border bg-background">
          <div className="overflow-x-auto">
            <Table className="min-w-[46rem]">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="px-5 py-3">Item</TableHead>
                  <TableHead className="py-3">Date</TableHead>
                  <TableHead className="py-3">Reference</TableHead>
                  <TableHead className="py-3 text-right">Amount</TableHead>
                  <TableHead className="px-5 py-3 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow
                    className="border-border hover:bg-muted"
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
    </BillingSection>
  );
}
