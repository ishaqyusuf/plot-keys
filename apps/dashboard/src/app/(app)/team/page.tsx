import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { DataTable } from "@/components/tables/teams/data-table";
import { TeamsSkeleton } from "@/components/tables/teams/skeleton";
import {
  canManageWorkspaceMembers,
  getWorkspaceInviteContext,
} from "@/components/team/team-access";
import { TeamHeader } from "@/components/team-header";
import { PendingInvites } from "@/components/team-pending-invites";
import { loadSortParams } from "@/hooks/use-sort-params";
import {
  loadTeamFilterParams,
  resolveTeamListInput,
} from "@/hooks/use-team-filter-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, prefetch, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Team | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function TeamPage({ searchParams }: Props) {
  const session = await requireOnboardedSession();
  const params = await searchParams;
  const currentUserId = session.user.id;
  const canInvite = canManageWorkspaceMembers(session.activeMembership.role);
  const inviteContext = getWorkspaceInviteContext();
  const filters = loadTeamFilterParams(params);
  const { sort } = loadSortParams(params);
  const listInput = resolveTeamListInput(filters, sort);
  const initialSettings = await getInitialTableSettings("team");

  batchPrefetch([
    trpc.team.getOverview.queryOptions(),
    trpc.team.listMembers.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
  ]);

  if (canInvite) {
    prefetch(trpc.team.listInvites.queryOptions());
  }

  return (
    <HydrateClient>
      <ScrollableContent>
        <div className="flex flex-col gap-6">
          <TeamHeader canInvite={canInvite} />

          {canInvite ? <PendingInvites {...inviteContext} /> : null}

          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<TeamsSkeleton />}>
              <DataTable
                canManage={canInvite}
                currentUserId={currentUserId}
                initialSettings={initialSettings}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      </ScrollableContent>
    </HydrateClient>
  );
}
