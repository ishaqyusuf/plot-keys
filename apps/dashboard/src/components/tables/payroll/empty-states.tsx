"use client";

import { Button } from "@plotkeys/ui/button";
import { SearchX, WalletCards } from "lucide-react";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { formatPayrollPeriod } from "@/components/payroll/payroll-utils";

type PayrollEmptyStateProps = {
  periodMonth: number;
  periodYear: number;
};

type PayrollNoResultsProps = {
  onClear: () => void;
};

export function PayrollEmptyState({
  periodMonth,
  periodYear,
}: PayrollEmptyStateProps) {
  return (
    <DashboardEmptyState
      description={`No payroll entries for ${formatPayrollPeriod(periodYear, periodMonth)}.`}
      icon={<WalletCards className="size-5" />}
      title="No payroll entries"
    />
  );
}

export function PayrollNoResults({ onClear }: PayrollNoResultsProps) {
  return (
    <div className="flex min-h-72 items-center justify-center px-5 py-10">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="size-5" />
        </div>
        <h3 className="font-medium text-foreground">
          No payroll entries found
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try another search term or clear the current payroll search.
        </p>
        <Button
          className="mt-4"
          onClick={onClear}
          size="sm"
          type="button"
          variant="outline"
        >
          Clear search
        </Button>
      </div>
    </div>
  );
}
