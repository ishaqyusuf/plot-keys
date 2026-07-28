"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function TotalCustomers() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.customers.stats.queryOptions());
  const total = (data.active ?? 0) + (data.inactive ?? 0) + (data.vip ?? 0);

  return (
    <div className="hidden border border-border bg-card p-5 transition-all duration-300 sm:block">
      <p className="text-xs text-muted-foreground">Total Customers</p>
      <p className="mt-3 text-xl font-medium">{total}</p>
      <p className="text-sm text-muted-foreground">
        Current company-scoped records
      </p>
    </div>
  );
}
