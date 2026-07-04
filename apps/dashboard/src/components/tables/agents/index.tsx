"use client";

import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback, useDeferredValue, useMemo } from "react";
import { DashboardTablePage } from "@/components/dashboard/dashboard-page";
import { useAgentsFilterParams } from "@/hooks/use-agents-filter-params";
import { useSortParams } from "@/hooks/use-sort-params";
import { useTRPC } from "@/trpc/client";
import type { TableSettings } from "@/utils/table-settings";
import { AgentsEmptyState, AgentsNoResults } from "./empty-states";
import { AgentInvites } from "./invites";
import { AgentsDataTable } from "./table";
import { AgentsPageHeader } from "./table-header";

type AgentsTableProps = {
  appBaseUrl: string;
  canManage: boolean;
  initialSettings?: Partial<TableSettings>;
  isDevMode: boolean;
};

export function AgentsTable({
  appBaseUrl,
  canManage,
  initialSettings,
  isDevMode,
}: AgentsTableProps) {
  const trpc = useTRPC();
  const { filters, hasFilters, setFilters } = useAgentsFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filters.q);
  const listInput = {
    q: deferredSearch,
    sort: params.sort,
  };
  const infiniteQueryOptions = trpc.workspace.listAgents.infiniteQueryOptions(
    listInput,
    {
      getNextPageParam: ({ meta }) => meta?.cursor,
    },
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const agents = useMemo(
    () => data.pages.flatMap((page) => page.data),
    [data],
  );
  const fetchMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);
  const agentCount = data.pages[0]?.meta.count ?? agents.length;

  return (
    <div className="flex flex-col gap-5">
      <AgentsPageHeader agentCount={agentCount} canManage={canManage} />

      {canManage ? (
        <AgentInvites appBaseUrl={appBaseUrl} isDevMode={isDevMode} />
      ) : null}

      {agents.length ? (
        <DashboardTablePage>
          <AgentsDataTable
            agents={agents}
            agentCount={agentCount}
            fetchNextPage={fetchMore}
            hasNextPage={Boolean(hasNextPage)}
            initialSettings={initialSettings}
            isFetchingNextPage={isFetchingNextPage}
          />
        </DashboardTablePage>
      ) : hasFilters ? (
        <AgentsNoResults onClear={() => setFilters(null)} />
      ) : (
        <AgentsEmptyState />
      )}
    </div>
  );
}
