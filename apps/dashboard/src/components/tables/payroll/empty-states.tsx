"use client";

import { formatPayrollPeriod } from "@/components/payroll/payroll-utils";
import {
  EmptyState as CoreEmptyState,
  NoResults as CoreNoResults,
} from "@/components/tables/core";
import { usePayrollFilterParams } from "@/hooks/use-payroll-filter-params";

type Props = {
  periodMonth: number;
  periodYear: number;
};

export function EmptyState({ periodMonth, periodYear }: Props) {
  return (
    <CoreEmptyState
      description={`No payroll entries for ${formatPayrollPeriod(
        periodYear,
        periodMonth,
      )}.`}
      title="No payroll entries"
    />
  );
}

export function NoResults() {
  const { setFilter } = usePayrollFilterParams();

  return <CoreNoResults onClear={() => setFilter(null)} />;
}
