"use client";

import { Button } from "@plotkeys/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@plotkeys/ui/sheet";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { PayrollEntryForm } from "@/components/forms/payroll-entry-form";
import { formatPayrollPeriod } from "@/components/payroll/payroll-utils";
import { DashboardSheetHeader } from "@/components/sheets/dashboard-sheet-layout";
import { useTRPC } from "@/trpc/client";

type PayrollEntrySheetProps = {
  periodMonth: number;
  periodYear: number;
};

export function PayrollEntrySheet({
  periodMonth,
  periodYear,
}: PayrollEntrySheetProps) {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const { data: employees } = useSuspenseQuery(
    trpc.workspace.listEmployees.queryOptions({
      size: 200,
      status: "active",
    }),
  );

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Add entry
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <DashboardSheetHeader
          description={`Record payroll for ${formatPayrollPeriod(periodYear, periodMonth)}.`}
          title="New payroll entry"
        />
        <PayrollEntryForm
          employees={employees.data}
          onCancel={() => setOpen(false)}
          periodMonth={periodMonth}
          periodYear={periodYear}
        />
      </SheetContent>
    </Sheet>
  );
}
