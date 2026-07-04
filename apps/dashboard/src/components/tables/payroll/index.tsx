"use client";

import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback, useDeferredValue, useMemo } from "react";
import { DashboardTablePage } from "@/components/dashboard/dashboard-page";
import { usePayrollFilterParams } from "@/hooks/use-payroll-filter-params";
import { useSortParams } from "@/hooks/use-sort-params";
import { useTRPC } from "@/trpc/client";
import type { TableSettings } from "@/utils/table-settings";
import { PayrollEmptyState, PayrollNoResults } from "./empty-states";
import { PayrollSummary } from "./summary";
import { PayrollDataTable } from "./table";
import { PayrollPageHeader } from "./table-header";

type PayrollTableProps = {
  initialSettings?: Partial<TableSettings>;
  periodMonth: number;
  periodYear: number;
};

export function PayrollTable({
  initialSettings,
  periodMonth,
  periodYear,
}: PayrollTableProps) {
  const trpc = useTRPC();
  const { filters, hasFilters, setFilters } = usePayrollFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filters.q);
  const periodInput = { periodMonth, periodYear };
  const listInput = {
    ...periodInput,
    q: deferredSearch,
    sort: params.sort,
  };
  const { data: periods } = useSuspenseQuery(
    trpc.workspace.listPayrollPeriods.queryOptions(),
  );
  const { data: summary } = useSuspenseQuery(
    trpc.workspace.getPayrollSummary.queryOptions(periodInput),
  );
  const infiniteQueryOptions =
    trpc.workspace.listPayrollEntries.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const entries = useMemo(
    () => data.pages.flatMap((page) => page.data),
    [data],
  );
  const fetchMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);
  const entryCount = data.pages[0]?.meta.count ?? entries.length;

  return (
    <div className="flex flex-col gap-5">
      <PayrollPageHeader
        periodMonth={periodMonth}
        periods={periods}
        periodYear={periodYear}
      />
      <PayrollSummary {...summary} />

      {entries.length ? (
        <DashboardTablePage>
          <PayrollDataTable
            entries={entries}
            entryCount={entryCount}
            fetchNextPage={fetchMore}
            hasNextPage={Boolean(hasNextPage)}
            initialSettings={initialSettings}
            isFetchingNextPage={isFetchingNextPage}
          />
        </DashboardTablePage>
      ) : hasFilters ? (
        <PayrollNoResults onClear={() => setFilters(null)} />
      ) : (
        <PayrollEmptyState
          periodMonth={periodMonth}
          periodYear={periodYear}
        />
      )}
    </div>
  );
}
