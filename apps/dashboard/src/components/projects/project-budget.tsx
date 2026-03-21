"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useTRPC } from "../../trpc/client";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatMinorCurrency(minor: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(minor / 100);
}

// ---------------------------------------------------------------------------
// Budget summary card
// ---------------------------------------------------------------------------

type BudgetSummary = {
  id: string;
  approvedBudgetMinor: number;
  forecastBudgetMinor: number;
  actualBudgetMinor: number;
  currency: string;
  notes: string | null;
};

export function BudgetSummaryCard({
  budget,
  projectId,
}: {
  budget: BudgetSummary | null;
  projectId: string;
}) {
  const router = useRouter();
  const trpc = useTRPC();

  const updateMutation = useMutation(
    trpc.projects.updateBudget.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const approved = Number.parseInt(
      String(fd.get("approvedBudget") ?? "0").replace(/[^0-9]/g, ""),
      10,
    );
    const forecast = Number.parseInt(
      String(fd.get("forecastBudget") ?? "0").replace(/[^0-9]/g, ""),
      10,
    );
    const actual = Number.parseInt(
      String(fd.get("actualBudget") ?? "0").replace(/[^0-9]/g, ""),
      10,
    );

    await updateMutation.mutateAsync({
      projectId,
      approvedBudgetMinor: Number.isNaN(approved) ? 0 : approved * 100,
      forecastBudgetMinor: Number.isNaN(forecast) ? 0 : forecast * 100,
      actualBudgetMinor: Number.isNaN(actual) ? 0 : actual * 100,
    });
  }

  const currency = budget?.currency ?? "NGN";

  return (
    <div className="space-y-6">
      {/* Summary strip */}
      {budget && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-md border p-4">
            <p className="text-xs text-muted-foreground">Approved Budget</p>
            <p className="mt-1 text-xl font-bold">
              {formatMinorCurrency(budget.approvedBudgetMinor, currency)}
            </p>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-xs text-muted-foreground">Forecast</p>
            <p className="mt-1 text-xl font-bold">
              {formatMinorCurrency(budget.forecastBudgetMinor, currency)}
            </p>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-xs text-muted-foreground">Actual Spend</p>
            <p className="mt-1 text-xl font-bold">
              {formatMinorCurrency(budget.actualBudgetMinor, currency)}
            </p>
            {budget.approvedBudgetMinor > 0 && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {Math.round(
                  (budget.actualBudgetMinor / budget.approvedBudgetMinor) * 100,
                )}
                % of approved
              </p>
            )}
          </div>
        </div>
      )}

      {/* Update form */}
      <form onSubmit={onSubmit} className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          Update Budget Totals (amounts in whole units, e.g. 5000000 for ₦5m)
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <Label htmlFor="approvedBudget">Approved</Label>
            <Input
              id="approvedBudget"
              name="approvedBudget"
              type="number"
              min={0}
              defaultValue={
                budget ? Math.round(budget.approvedBudgetMinor / 100) : 0
              }
            />
          </div>
          <div>
            <Label htmlFor="forecastBudget">Forecast</Label>
            <Input
              id="forecastBudget"
              name="forecastBudget"
              type="number"
              min={0}
              defaultValue={
                budget ? Math.round(budget.forecastBudgetMinor / 100) : 0
              }
            />
          </div>
          <div>
            <Label htmlFor="actualBudget">Actual</Label>
            <Input
              id="actualBudget"
              name="actualBudget"
              type="number"
              min={0}
              defaultValue={
                budget ? Math.round(budget.actualBudgetMinor / 100) : 0
              }
            />
          </div>
        </div>
        <Button disabled={updateMutation.isPending} type="submit" size="sm">
          {updateMutation.isPending ? "Saving…" : "Save Totals"}
        </Button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Budget line items list
// ---------------------------------------------------------------------------

type LineItem = {
  id: string;
  category: string;
  description: string;
  estimatedMinor: number;
  actualMinor: number;
  notes: string | null;
};

export function BudgetLineItemList({
  lineItems,
  projectId,
  currency,
}: {
  lineItems: LineItem[];
  projectId: string;
  currency: string;
}) {
  const router = useRouter();
  const trpc = useTRPC();

  const deleteMutation = useMutation(
    trpc.projects.deleteBudgetLineItem.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  if (lineItems.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No line items yet. Add one below.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
        <span className="col-span-3">Category</span>
        <span className="col-span-4">Description</span>
        <span className="col-span-2 text-right">Estimated</span>
        <span className="col-span-2 text-right">Actual</span>
        <span className="col-span-1" />
      </div>
      {lineItems.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-12 items-center gap-2 rounded-md border px-3 py-2 text-sm"
        >
          <span className="col-span-3 font-medium">{item.category}</span>
          <span className="col-span-4 text-muted-foreground">
            {item.description}
          </span>
          <span className="col-span-2 text-right">
            {formatMinorCurrency(item.estimatedMinor, currency)}
          </span>
          <span className="col-span-2 text-right">
            {formatMinorCurrency(item.actualMinor, currency)}
          </span>
          <div className="col-span-1 flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-destructive hover:bg-destructive/10"
              disabled={deleteMutation.isPending}
              onClick={() =>
                deleteMutation.mutate({ projectId, lineItemId: item.id })
              }
            >
              ×
            </Button>
          </div>
        </div>
      ))}
      {/* Totals row */}
      <div className="grid grid-cols-12 gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm font-semibold">
        <span className="col-span-7">Total</span>
        <span className="col-span-2 text-right">
          {formatMinorCurrency(
            lineItems.reduce((s, i) => s + i.estimatedMinor, 0),
            currency,
          )}
        </span>
        <span className="col-span-2 text-right">
          {formatMinorCurrency(
            lineItems.reduce((s, i) => s + i.actualMinor, 0),
            currency,
          )}
        </span>
        <span className="col-span-1" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add budget line item form
// ---------------------------------------------------------------------------

export function AddBudgetLineItemForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const trpc = useTRPC();

  const addMutation = useMutation(
    trpc.projects.addBudgetLineItem.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const category = String(fd.get("category") ?? "").trim();
    const description = String(fd.get("description") ?? "").trim();
    const estimated = Number.parseInt(
      String(fd.get("estimated") ?? "0"),
      10,
    );
    const actual = Number.parseInt(String(fd.get("actual") ?? "0"), 10);

    if (!category || !description) return;

    await addMutation.mutateAsync({
      projectId,
      category,
      description,
      estimatedMinor: Number.isNaN(estimated) ? 0 : estimated * 100,
      actualMinor: Number.isNaN(actual) ? 0 : actual * 100,
    });

    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <p className="text-sm font-medium">Add Line Item</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="col-span-1">
          <Label htmlFor="liCategory">Category</Label>
          <Input
            id="liCategory"
            name="category"
            required
            placeholder="e.g. Civil Works"
          />
        </div>
        <div className="col-span-1 sm:col-span-1">
          <Label htmlFor="liDescription">Description</Label>
          <Input
            id="liDescription"
            name="description"
            required
            placeholder="Short description"
          />
        </div>
        <div>
          <Label htmlFor="liEstimated">Estimated (₦)</Label>
          <Input
            id="liEstimated"
            name="estimated"
            type="number"
            min={0}
            defaultValue={0}
          />
        </div>
        <div>
          <Label htmlFor="liActual">Actual (₦)</Label>
          <Input
            id="liActual"
            name="actual"
            type="number"
            min={0}
            defaultValue={0}
          />
        </div>
      </div>
      <Button disabled={addMutation.isPending} type="submit" size="sm">
        {addMutation.isPending ? "Adding…" : "Add Line Item"}
      </Button>
    </form>
  );
}
