"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/components/payroll/payroll-utils";
import { useTRPC } from "@/trpc/client";

type Props = {
  periodMonth: number;
  periodYear: number;
};

export function PayrollSummary({ periodMonth, periodYear }: Props) {
  const trpc = useTRPC();
  const { data: summary } = useSuspenseQuery(
    trpc.payroll.summary.queryOptions({
      periodMonth,
      periodYear,
    }),
  );
  const stats = [
    { label: "Entries", value: summary.totalEntries },
    { label: "Gross total", value: formatCurrency(summary.totalGross) },
    { label: "Net total", value: formatCurrency(summary.totalNet) },
    {
      label: "Paid / pending",
      value: `${summary.paidCount} / ${summary.pendingCount}`,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          className="border border-border bg-card p-5 transition-all duration-300"
          key={stat.label}
        >
          <p className="text-xs text-muted-foreground">{stat.label}</p>
          <p className="mt-3 text-xl font-medium">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
