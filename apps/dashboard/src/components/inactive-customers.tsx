"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function InactiveCustomers() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.customers.stats.queryOptions());

  return (
    <div className="hidden border border-border bg-card p-5 transition-all duration-300 sm:block">
      <p className="text-xs text-muted-foreground">Inactive Customers</p>
      <p className="mt-3 text-xl font-medium">{data.inactive ?? 0}</p>
      <p className="text-sm text-muted-foreground">
        No current active CRM status
      </p>
    </div>
  );
}
