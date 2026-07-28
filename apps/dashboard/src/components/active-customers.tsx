"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function ActiveCustomers() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.customers.stats.queryOptions());

  return (
    <div className="hidden border border-border bg-card p-5 transition-all duration-300 sm:block">
      <p className="text-xs text-muted-foreground">Active Customers</p>
      <p className="mt-3 text-xl font-medium">{data.active ?? 0}</p>
      <p className="text-sm text-muted-foreground">Marked active in the CRM</p>
    </div>
  );
}
