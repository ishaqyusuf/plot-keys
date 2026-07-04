"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useDeferredValue, useMemo } from "react";
import { DashboardTablePage } from "@/components/dashboard/dashboard-page";
import { useDepartmentsFilterParams } from "@/hooks/use-departments-filter-params";
import { useSortParams } from "@/hooks/use-sort-params";
import { useTRPC } from "@/trpc/client";
import type { TableSettings } from "@/utils/table-settings";
import { DepartmentsEmptyState, DepartmentsNoResults } from "./empty-states";
import { DepartmentsDataTable } from "./table";
import { DepartmentsPageHeader } from "./table-header";

type DepartmentsTableProps = {
  initialSettings?: Partial<TableSettings>;
};

export function DepartmentsTable({ initialSettings }: DepartmentsTableProps) {
  const trpc = useTRPC();
  const { filters, hasFilters, setFilters } = useDepartmentsFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filters.q);
  const listInput = {
    q: deferredSearch,
    sort: params.sort,
  };
  const infiniteQueryOptions =
    trpc.workspace.listDepartments.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const departments = useMemo(
    () => data.pages.flatMap((page) => page.data),
    [data],
  );
  const fetchMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);
  const departmentCount = data.pages[0]?.meta.count ?? departments.length;

  return (
    <div className="flex flex-col gap-5">
      <DepartmentsPageHeader departmentCount={departmentCount} />

      {departments.length ? (
        <DashboardTablePage>
          <DepartmentsDataTable
            departments={departments}
            departmentCount={departmentCount}
            fetchNextPage={fetchMore}
            hasNextPage={Boolean(hasNextPage)}
            initialSettings={initialSettings}
            isFetchingNextPage={isFetchingNextPage}
          />
        </DashboardTablePage>
      ) : hasFilters ? (
        <DepartmentsNoResults onClear={() => setFilters(null)} />
      ) : (
        <DepartmentsEmptyState />
      )}
    </div>
  );
}
