"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  DashboardTablePage,
  DashboardTablePageBody,
} from "@/components/dashboard/dashboard-page";
import { useCustomersFilterParams } from "@/hooks/use-customers-filter-params";
import { useTRPC } from "@/trpc/client";
import type { TableSettings } from "@/utils/table-settings";
import { CustomersSummary } from "./summary";
import { CustomersDataTable } from "./data-table";
import { CustomersHeader } from "./table-header";

type CustomersTableProps = {
  canManage: boolean;
  initialSettings?: Partial<TableSettings>;
};

export function CustomersTable({
  canManage,
  initialSettings,
}: CustomersTableProps) {
  const trpc = useTRPC();
  const { filters } = useCustomersFilterParams();
  const { data: stats } = useSuspenseQuery(
    trpc.customers.stats.queryOptions(),
  );
  const statMap: Record<string, number> = { active: 0, inactive: 0, vip: 0 };
  Object.assign(statMap, stats);
  const totalCustomers = Object.values(statMap).reduce(
    (total, count) => total + count,
    0,
  );
  const query = filters.q?.trim() ?? "";

  return (
    <div className="flex flex-col gap-5">
      <CustomersSummary stats={statMap} />

      <DashboardTablePage>
        <CustomersHeader
          canManage={canManage}
          count={totalCustomers}
          query={query}
        />
        <DashboardTablePageBody>
          <CustomersDataTable
            canManage={canManage}
            initialSettings={initialSettings}
          />
        </DashboardTablePageBody>
      </DashboardTablePage>
    </div>
  );
}
