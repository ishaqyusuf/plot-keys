"use client";

import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { Skeleton } from "@plotkeys/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { PayrollEntryForm } from "@/components/forms/payroll-entry-form";
import {
  formatPayrollPeriod,
  getPayrollPeriod,
} from "@/components/payroll/payroll-utils";
import { StackedSheetHeader } from "@/components/stacked-sheet-header";
import { usePayrollParams } from "@/hooks/use-payroll-params";
import { useTRPC } from "@/trpc/client";

export function PayrollEntryCreateSheet() {
  const searchParams = useSearchParams();
  const trpc = useTRPC();
  const { createPayrollEntry, setParams } = usePayrollParams();
  const isOpen = Boolean(createPayrollEntry);
  const { periodMonth, periodYear } = getPayrollPeriod({
    month: searchParams.get("month") ?? undefined,
    year: searchParams.get("year") ?? undefined,
  });
  const periodLabel = formatPayrollPeriod(periodYear, periodMonth);
  const { data: employees, isLoading } = useQuery(
    trpc.employees.list.queryOptions(
      {
        size: 200,
        status: "active",
      },
      {
        enabled: isOpen,
        staleTime: 30 * 1000,
      },
    ),
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setParams(null)}>
      <SheetContent stack>
        <StackedSheetHeader
          description={`Record payroll for ${periodLabel}.`}
          onClose={() => setParams(null)}
          title="New payroll entry"
        />

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <PayrollEntryForm
            employees={employees?.data ?? []}
            onCancel={() => setParams(null)}
            onSuccess={() => setParams(null)}
            periodMonth={periodMonth}
            periodYear={periodYear}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
