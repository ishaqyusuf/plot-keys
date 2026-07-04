"use client";

import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback, useDeferredValue, useMemo } from "react";
import { DashboardTablePage } from "@/components/dashboard/dashboard-page";
import { isLeadStatus, type LeadStatus } from "@/components/leads/lead-utils";
import { useLeadsFilterParams } from "@/hooks/use-leads-filter-params";
import { useSortParams } from "@/hooks/use-sort-params";
import { useTRPC } from "@/trpc/client";
import type { TableSettings } from "@/utils/table-settings";
import { LeadsEmptyState, LeadsNoResults } from "./empty-states";
import { LeadsDataTable } from "./table";
import { LeadsPageHeader } from "./table-header";

type LeadsTableProps = {
  initialSettings?: Partial<TableSettings>;
};

export function LeadsTable({ initialSettings }: LeadsTableProps) {
  const trpc = useTRPC();
  const { filters, hasFilters, setFilters } = useLeadsFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filters.q);
  const statusParam = filters.status ?? undefined;
  const activeStatus: LeadStatus | undefined = isLeadStatus(statusParam)
    ? statusParam
    : undefined;
  const listInput = {
    q: deferredSearch,
    sort: params.sort,
    status: activeStatus,
  };
  const { data: stats } = useSuspenseQuery(
    trpc.workspace.getLeadStats.queryOptions(),
  );
  const infiniteQueryOptions = trpc.workspace.listLeads.infiniteQueryOptions(
    listInput,
    {
      getNextPageParam: ({ meta }) => meta?.cursor,
    },
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const leads = useMemo(
    () => data.pages.flatMap((page) => page.data),
    [data],
  );
  const fetchMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);
  const leadCount = data.pages[0]?.meta.count ?? leads.length;

  return (
    <div className="flex flex-col gap-5">
      <LeadsPageHeader activeStatus={activeStatus} stats={stats} />

      {leads.length ? (
        <DashboardTablePage>
          <LeadsDataTable
            fetchNextPage={fetchMore}
            hasNextPage={Boolean(hasNextPage)}
            initialSettings={initialSettings}
            isFetchingNextPage={isFetchingNextPage}
            leadCount={leadCount}
            leads={leads}
          />
        </DashboardTablePage>
      ) : hasFilters ? (
        <LeadsNoResults onClear={() => setFilters(null)} />
      ) : (
        <LeadsEmptyState activeStatus={activeStatus} />
      )}
    </div>
  );
}
