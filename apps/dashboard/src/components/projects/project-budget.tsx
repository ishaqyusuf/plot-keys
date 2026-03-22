"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useTRPC } from "../../trpc/client";

// ---------------------------------------------------------------------------
// Category config
// ---------------------------------------------------------------------------

const categoryLabels: Record<string, string> = {
  contingency: "Contingency",
  external_works: "External Works",
  finishing: "Finishing",
  mep: "MEP",
  other: "Other",
  preliminaries: "Preliminaries",
  professional_fees: "Professional Fees",
  substructure: "Substructure",
  superstructure: "Superstructure",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(minor: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(minor / 100);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BudgetLineItem = {
  id: string;
  category: string;
  description: string;
  quantity: number | null;
  unitRateMinor: number | null;
  estimatedMinor: number;
  actualMinor: number;
  notes: string | null;
};

type Budget = {
  id: string;
  currency: string;
  approvedBudgetMinor: number;
  forecastBudgetMinor: number;
  actualBudgetMinor: number;
  lineItems: BudgetLineItem[];
};

// ---------------------------------------------------------------------------
// Budget Summary
// ---------------------------------------------------------------------------

export function BudgetSummary({
  budget,
  projectId,
}: {
  budget: Budget | null;
  projectId: string;
}) {
  const router = useRouter();
  const trpc = useTRPC();

  const upsertMutation = useMutation(
    trpc.projects.upsertBudget.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    await upsertMutation.mutateAsync({
      projectId,
      currency: String(fd.get("currency") ?? "NGN").trim() || "NGN",
      approvedBudgetMinor: Math.round(
        Number(fd.get("approvedBudget") ?? 0) * 100,
      ),
      forecastBudgetMinor: Math.round(
        Number(fd.get("forecastBudget") ?? 0) * 100,
      ),
      actualBudgetMinor: Math.round(
        Number(fd.get("actualBudget") ?? 0) * 100,
      ),
    });
  }

  if (!budget) {
    return (
      <form onSubmit={onSubmit} className="space-y-3">
        <p className="text-sm text-muted-foreground">
          No budget set for this project.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <Label htmlFor="approvedBudget">Approved Budget</Label>
            <Input
              id="approvedBudget"
              name="approvedBudget"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="forecastBudget">Forecast</Label>
            <Input
              id="forecastBudget"
              name="forecastBudget"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              name="currency"
              defaultValue="NGN"
              placeholder="NGN"
            />
          </div>
        </div>
        <input type="hidden" name="actualBudget" value="0" />
        <Button disabled={upsertMutation.isPending} type="submit">
          {upsertMutation.isPending ? "Creating…" : "Create Budget"}
        </Button>
      </form>
    );
  }

  const variance = budget.approvedBudgetMinor - budget.actualBudgetMinor;
  const lineEstTotal = budget.lineItems.reduce(
    (s, li) => s + li.estimatedMinor,
    0,
  );
  const lineActTotal = budget.lineItems.reduce(
    (s, li) => s + li.actualMinor,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs text-muted-foreground">Approved</p>
          <p className="text-lg font-bold">
            {formatCurrency(budget.approvedBudgetMinor, budget.currency)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Forecast</p>
          <p className="text-lg font-bold">
            {formatCurrency(budget.forecastBudgetMinor, budget.currency)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Actual</p>
          <p className="text-lg font-bold">
            {formatCurrency(budget.actualBudgetMinor, budget.currency)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Variance</p>
          <p
            className={`text-lg font-bold ${variance >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {formatCurrency(variance, budget.currency)}
          </p>
        </div>
      </div>

      {/* Line items summary */}
      {budget.lineItems.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Line items: {formatCurrency(lineEstTotal, budget.currency)} estimated
          / {formatCurrency(lineActTotal, budget.currency)} actual
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Budget Line Items List
// ---------------------------------------------------------------------------

export function BudgetLineItemList({
  lineItems,
  projectId,
  currency,
}: {
  lineItems: BudgetLineItem[];
  projectId: string;
  currency: string;
}) {
  const router = useRouter();
  const trpc = useTRPC();

  const deleteMutation = useMutation(
    trpc.projects.deleteBudgetLine.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  return (
    <div className="mb-4 space-y-2">
      {lineItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-md border p-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{item.description}</span>
              <Badge variant="outline">
                {categoryLabels[item.category] ?? item.category}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Est: {formatCurrency(item.estimatedMinor, currency)} · Act:{" "}
              {formatCurrency(item.actualMinor, currency)}
              {item.quantity != null
                ? ` · Qty: ${item.quantity}`
                : ""}
              {item.unitRateMinor != null
                ? ` · Rate: ${formatCurrency(item.unitRateMinor, currency)}`
                : ""}
            </p>
            {item.notes && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.notes}
              </p>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            disabled={deleteMutation.isPending}
            onClick={() =>
              deleteMutation.mutate({
                projectId,
                lineItemId: item.id,
              })
            }
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Create Budget Line Item Form
// ---------------------------------------------------------------------------

export function CreateBudgetLineForm({
  projectId,
  budgetId,
}: {
  projectId: string;
  budgetId: string;
}) {
  const router = useRouter();
  const trpc = useTRPC();

  const createMutation = useMutation(
    trpc.projects.createBudgetLine.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const description = String(fd.get("description") ?? "").trim();
    if (!description) return;

    await createMutation.mutateAsync({
      projectId,
      budgetId,
      description,
      category:
        (String(fd.get("category") ?? "") as
          | "preliminaries"
          | "substructure"
          | "superstructure"
          | "mep"
          | "finishing"
          | "external_works"
          | "contingency"
          | "professional_fees"
          | "other") || "other",
      estimatedMinor: Math.round(
        Number(fd.get("estimatedAmount") ?? 0) * 100,
      ),
      actualMinor: Math.round(Number(fd.get("actualAmount") ?? 0) * 100),
      quantity: fd.get("quantity")
        ? Number(fd.get("quantity"))
        : null,
      unitRateMinor: fd.get("unitRate")
        ? Math.round(Number(fd.get("unitRate")) * 100)
        : null,
      notes: String(fd.get("notes") ?? "").trim() || null,
    });

    e.currentTarget.reset();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      <div>
        <Label htmlFor="lineDesc">Description *</Label>
        <Input
          id="lineDesc"
          name="description"
          required
          placeholder="Line item description"
        />
      </div>
      <div>
        <Label htmlFor="lineCategory">Category</Label>
        <select
          id="lineCategory"
          name="category"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
        >
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="lineEstimated">Estimated Amount</Label>
        <Input
          id="lineEstimated"
          name="estimatedAmount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
        />
      </div>
      <div>
        <Label htmlFor="lineActual">Actual Amount</Label>
        <Input
          id="lineActual"
          name="actualAmount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
        />
      </div>
      <div className="sm:col-span-2">
        <Button disabled={createMutation.isPending} type="submit">
          {createMutation.isPending ? "Adding…" : "Add Line Item"}
        </Button>
      </div>
    </form>
  );
}
