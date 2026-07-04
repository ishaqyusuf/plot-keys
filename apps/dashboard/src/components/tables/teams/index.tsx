"use client";

import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback, useDeferredValue, useMemo } from "react";
import { DashboardTablePage } from "@/components/dashboard/dashboard-page";
import { useSortParams } from "@/hooks/use-sort-params";
import { useTeamFilterParams } from "@/hooks/use-team-filter-params";
import { useTRPC } from "@/trpc/client";
import type { TableSettings } from "@/utils/table-settings";
import { TeamsEmptyState, TeamsNoResults } from "./empty-states";
import { PendingInvites } from "./invites";
import { TeamMembersTable } from "./table";
import { TeamsPageHeader } from "./table-header";

type TeamsTableProps = {
  appBaseUrl: string;
  canInvite: boolean;
  currentUserId: string;
  initialSettings?: Partial<TableSettings>;
  isDevMode: boolean;
};

export function TeamsTable({
  appBaseUrl,
  canInvite,
  currentUserId,
  initialSettings,
  isDevMode,
}: TeamsTableProps) {
  const trpc = useTRPC();
  const { filters, hasFilters, setFilters } = useTeamFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filters.q);
  const listInput = {
    q: deferredSearch,
    sort: params.sort,
  };
  const { data: overview } = useSuspenseQuery(
    trpc.team.getOverview.queryOptions(),
  );
  const infiniteQueryOptions = trpc.team.listMembers.infiniteQueryOptions(
    listInput,
    {
      getNextPageParam: ({ meta }) => meta?.cursor,
    },
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const members = useMemo(
    () => data.pages.flatMap((page) => page.data),
    [data],
  );
  const fetchMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);
  const memberCount = data.pages[0]?.meta.count ?? members.length;
  const atCap = overview.cap !== null && overview.activeCount >= overview.cap;

  return (
    <div className="flex flex-col gap-5">
      <TeamsPageHeader
        atCap={atCap}
        canInvite={canInvite}
        cap={overview.cap}
        memberCount={memberCount}
        planTier={overview.planTier}
      />

      {members.length ? (
        <DashboardTablePage>
          <TeamMembersTable
            canManage={canInvite}
            currentUserId={currentUserId}
            fetchNextPage={fetchMore}
            hasNextPage={Boolean(hasNextPage)}
            initialSettings={initialSettings}
            isFetchingNextPage={isFetchingNextPage}
            memberCount={memberCount}
            members={members}
          />
        </DashboardTablePage>
      ) : hasFilters ? (
        <TeamsNoResults onClear={() => setFilters(null)} />
      ) : (
        <TeamsEmptyState />
      )}

      {canInvite ? (
        <PendingInvites appBaseUrl={appBaseUrl} isDevMode={isDevMode} />
      ) : null}
    </div>
  );
}
