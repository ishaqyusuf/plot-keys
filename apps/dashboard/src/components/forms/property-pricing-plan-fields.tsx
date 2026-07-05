"use client";

import { Button } from "@plotkeys/ui/button";
import { CurrencyInput } from "@plotkeys/ui/currency-input";
import { FieldDescription, FieldLegend, FieldSet } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@plotkeys/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@plotkeys/ui/table";
import { PlusIcon, Trash2Icon } from "lucide-react";
import type { ReactNode } from "react";

export type PricingPlanDraft = {
  id: string;
  amount: string;
  initialDepositPercent: string;
  months: string;
};

type PricingPlanSource = {
  paymentPlanAmount?: string | null;
  paymentPlanInitialDepositPercent?: number | null;
  paymentPlanMonths?: number | null;
  paymentPlansJson?: unknown;
};

type PricingPlanField = keyof Omit<PricingPlanDraft, "id">;

type PropertyPricingPlanFieldsProps = {
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: PricingPlanField, value: string) => void;
  pricingPlans: PricingPlanDraft[];
  quickFill?: ReactNode;
};

function parseCurrencyValue(value?: string | null) {
  if (!value) return 0;
  const normalized = value.replace(/[^\d.-]/g, "");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

function formatNaira(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "";
  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function createPricingPlanDraft(
  overrides: Partial<Omit<PricingPlanDraft, "id">> = {},
): PricingPlanDraft {
  return {
    amount: overrides.amount ?? "",
    id: crypto.randomUUID(),
    initialDepositPercent: overrides.initialDepositPercent ?? "",
    months: overrides.months ?? "",
  };
}

export function normalizePricingPlan(plan: Omit<PricingPlanDraft, "id">) {
  const amount = parseCurrencyValue(plan.amount);
  const depositPercentValue = Number(plan.initialDepositPercent || 0);
  const depositPercent = Number.isFinite(depositPercentValue)
    ? Math.min(Math.max(depositPercentValue, 0), 100)
    : 0;
  const months = Number(plan.months || 0);
  const initialDepositAmount = amount * (depositPercent / 100);
  const monthlyAmount =
    amount > 0 && months > 0
      ? formatNaira((amount - initialDepositAmount) / months)
      : "";

  return {
    amount: plan.amount.trim(),
    initialDepositAmount: formatNaira(initialDepositAmount),
    initialDepositPercent: plan.initialDepositPercent.trim(),
    monthlyAmount,
    months: plan.months.trim(),
  };
}

export function getInitialPricingPlans(
  property: PricingPlanSource | null,
): PricingPlanDraft[] {
  if (Array.isArray(property?.paymentPlansJson)) {
    const plans = property.paymentPlansJson
      .map((plan) => {
        if (!plan || typeof plan !== "object") return null;
        const entry = plan as Record<string, unknown>;
        return createPricingPlanDraft({
          amount: String(entry.amount ?? ""),
          initialDepositPercent: String(entry.initialDepositPercent ?? ""),
          months: String(entry.months ?? ""),
        });
      })
      .filter((plan): plan is PricingPlanDraft => Boolean(plan));

    if (plans.length > 0) return plans;
  }

  return [
    createPricingPlanDraft({
      amount: property?.paymentPlanAmount ?? "",
      initialDepositPercent:
        property?.paymentPlanInitialDepositPercent?.toString() ?? "",
      months: property?.paymentPlanMonths?.toString() ?? "",
    }),
  ];
}

export function PropertyPricingPlanFields({
  onAdd,
  onRemove,
  onUpdate,
  pricingPlans,
  quickFill,
}: PropertyPricingPlanFieldsProps) {
  return (
    <FieldSet>
      <FieldLegend>Pricing plan</FieldLegend>
      <FieldDescription>
        Add the payment timeline and deposit terms for this listing.
      </FieldDescription>
      <div className="max-w-full overflow-hidden">
        <Table className="min-w-[41rem] table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-24 px-0 pr-3">Months</TableHead>
              <TableHead className="w-36 px-0 pr-3">Amount</TableHead>
              <TableHead className="w-56 px-0 pr-3">Initial Deposit</TableHead>
              <TableHead className="w-36 px-0 pr-3">Monthly</TableHead>
              <TableHead className="w-12 px-0 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pricingPlans.map((plan) => {
              const normalizedPlan = normalizePricingPlan(plan);

              return (
                <TableRow className="hover:bg-transparent" key={plan.id}>
                  <TableCell className="w-24 px-0 pr-3">
                    <Input
                      aria-label="Payment plan months"
                      className="w-full"
                      min={1}
                      onChange={(event) =>
                        onUpdate(plan.id, "months", event.target.value)
                      }
                      placeholder="12"
                      type="number"
                      value={plan.months}
                    />
                  </TableCell>
                  <TableCell className="w-36 px-0 pr-3">
                    <CurrencyInput
                      allowLeadingZeros={false}
                      aria-label="Payment plan amount"
                      className="w-full"
                      onValueChange={(values) =>
                        onUpdate(plan.id, "amount", values.value)
                      }
                      placeholder="₦45,000,000"
                      value={plan.amount}
                    />
                  </TableCell>
                  <TableCell className="w-56 px-0 pr-3">
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <InputGroupText className="text-xs">
                          ({normalizedPlan.initialDepositAmount || "₦0"})
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        aria-label="Initial deposit percent"
                        className="text-right"
                        max={100}
                        min={0}
                        onChange={(event) =>
                          onUpdate(
                            plan.id,
                            "initialDepositPercent",
                            event.target.value,
                          )
                        }
                        placeholder="20"
                        step="0.1"
                        type="number"
                        value={plan.initialDepositPercent}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText>%</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </TableCell>
                  <TableCell className="w-36 px-0 pr-3">
                    <Input
                      aria-label="Generated monthly payment"
                      className="w-full"
                      readOnly
                      value={normalizedPlan.monthlyAmount}
                    />
                  </TableCell>
                  <TableCell className="w-12 px-0 text-right">
                    <Button
                      aria-label="Remove pricing plan"
                      disabled={pricingPlans.length <= 1}
                      onClick={() => onRemove(plan.id)}
                      size="icon-sm"
                      type="button"
                      variant="ghost"
                    >
                      <Trash2Icon />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {quickFill}
        <Button
          className="w-fit"
          onClick={onAdd}
          size="sm"
          type="button"
          variant="outline"
        >
          <PlusIcon data-icon="inline-start" />
          Add pricing
        </Button>
      </div>
    </FieldSet>
  );
}
