"use client";

import { ProjectBudgetSummaryForm } from "@/components/forms/project-budget-summary-form";
import type { ProjectBudget } from "@/components/projects/project-budget-line-items";
import { formatBudgetCurrency } from "@/components/projects/project-budget-utils";

type Props = {
  budget: ProjectBudget;
  projectId: string;
};

export function BudgetSummary({ budget, projectId }: Props) {
  if (!budget) {
    return <ProjectBudgetSummaryForm projectId={projectId} />;
  }

  const variance = budget.approvedBudgetMinor - budget.actualBudgetMinor;
  const lineEstimatedTotal = budget.lineItems.reduce(
    (total, item) => total + item.estimatedMinor,
    0,
  );
  const lineActualTotal = budget.lineItems.reduce(
    (total, item) => total + item.actualMinor,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="border border-border bg-card p-4 transition-all duration-300">
          <p className="text-xs text-muted-foreground">Approved</p>
          <p className="mt-3 text-xl font-medium">
            {formatBudgetCurrency(budget.approvedBudgetMinor, budget.currency)}
          </p>
        </div>
        <div className="border border-border bg-card p-4 transition-all duration-300">
          <p className="text-xs text-muted-foreground">Forecast</p>
          <p className="mt-3 text-xl font-medium">
            {formatBudgetCurrency(budget.forecastBudgetMinor, budget.currency)}
          </p>
        </div>
        <div className="border border-border bg-card p-4 transition-all duration-300">
          <p className="text-xs text-muted-foreground">Actual</p>
          <p className="mt-3 text-xl font-medium">
            {formatBudgetCurrency(budget.actualBudgetMinor, budget.currency)}
          </p>
        </div>
        <div className="border border-border bg-card p-4 transition-all duration-300">
          <p className="text-xs text-muted-foreground">Variance</p>
          <p
            className={
              variance >= 0
                ? "mt-3 text-xl font-medium text-success"
                : "mt-3 text-xl font-medium text-destructive"
            }
          >
            {formatBudgetCurrency(variance, budget.currency)}
          </p>
        </div>
      </div>

      {budget.lineItems.length > 0 ? (
        <p className="text-xs text-muted-foreground">
          Line items:{" "}
          {formatBudgetCurrency(lineEstimatedTotal, budget.currency)} estimated
          / {formatBudgetCurrency(lineActualTotal, budget.currency)} actual
        </p>
      ) : null}
    </div>
  );
}
