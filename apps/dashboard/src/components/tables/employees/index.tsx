"use client";

import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback, useDeferredValue, useMemo } from "react";
import { DashboardTablePage } from "@/components/dashboard/dashboard-page";
import {
  isEmployeeStatus,
  type EmployeeStatus,
} from "@/components/employees/employee-utils";
import { useEmployeesFilterParams } from "@/hooks/use-employees-filter-params";
import { useSortParams } from "@/hooks/use-sort-params";
import { useTRPC } from "@/trpc/client";
import type { TableSettings } from "@/utils/table-settings";
import { EmployeesEmptyState, EmployeesNoResults } from "./empty-states";
import { EmployeeInvites } from "./invites";
import { EmployeesDataTable } from "./table";
import { EmployeesPageHeader } from "./table-header";

type EmployeesTableProps = {
  appBaseUrl: string;
  canManage: boolean;
  initialSettings?: Partial<TableSettings>;
  isDevMode: boolean;
};

export function EmployeesTable({
  appBaseUrl,
  canManage,
  initialSettings,
  isDevMode,
}: EmployeesTableProps) {
  const trpc = useTRPC();
  const { filters, hasFilters, setFilters } = useEmployeesFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filters.q);
  const departmentId = filters.department?.trim() || undefined;
  const statusParam = filters.status ?? undefined;
  const activeStatus: EmployeeStatus | undefined = isEmployeeStatus(statusParam)
    ? statusParam
    : undefined;
  const listInput = {
    departmentId,
    q: deferredSearch,
    sort: params.sort,
    status: activeStatus,
  };
  const { data: stats } = useSuspenseQuery(
    trpc.workspace.getEmployeeStats.queryOptions(),
  );
  const infiniteQueryOptions = trpc.workspace.listEmployees.infiniteQueryOptions(
    listInput,
    {
      getNextPageParam: ({ meta }) => meta?.cursor,
    },
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const employees = useMemo(
    () => data.pages.flatMap((page) => page.data),
    [data],
  );
  const fetchMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);
  const employeeCount = data.pages[0]?.meta.count ?? employees.length;

  return (
    <div className="flex flex-col gap-5">
      <EmployeesPageHeader
        activeStatus={activeStatus}
        canManage={canManage}
        departmentId={departmentId}
        stats={stats}
      />

      {canManage ? (
        <EmployeeInvites appBaseUrl={appBaseUrl} isDevMode={isDevMode} />
      ) : null}

      {employees.length ? (
        <DashboardTablePage>
          <EmployeesDataTable
            employees={employees}
            employeeCount={employeeCount}
            fetchNextPage={fetchMore}
            hasNextPage={Boolean(hasNextPage)}
            initialSettings={initialSettings}
            isFetchingNextPage={isFetchingNextPage}
          />
        </DashboardTablePage>
      ) : hasFilters ? (
        <EmployeesNoResults onClear={() => setFilters(null)} />
      ) : (
        <EmployeesEmptyState
          activeStatus={activeStatus}
          departmentId={departmentId}
        />
      )}
    </div>
  );
}
