import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { AgentsHeader } from "@/components/agents-header";
import { AgentInvites } from "@/components/agents-invites";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { DataTable } from "@/components/tables/agents/data-table";
import { AgentsSkeleton } from "@/components/tables/agents/skeleton";
import {
  canManageWorkspaceMembers,
  getWorkspaceInviteContext,
} from "@/components/team/team-access";
import {
  loadAgentFilterParams,
  resolveAgentListInput,
} from "@/hooks/use-agent-filter-params";
import { loadSortParams } from "@/hooks/use-sort-params";
import { requireOnboardedSession } from "@/lib/session";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Agents | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function AgentsPage({ searchParams }: Props) {
  const session = await requireOnboardedSession();
  const params = await searchParams;
  const canManage = canManageWorkspaceMembers(session.activeMembership.role);
  const inviteContext = getWorkspaceInviteContext();
  const filters = loadAgentFilterParams(params);
  const { sort } = loadSortParams(params);
  const listInput = resolveAgentListInput(filters, sort);
  const initialSettings = await getInitialTableSettings("agents");

  prefetch(
    trpc.agents.list.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
  );

  if (canManage) {
    prefetch(trpc.team.listInvites.queryOptions());
  }

  return (
    <HydrateClient>
      <ScrollableContent>
        <div className="flex flex-col gap-6">
          <AgentsHeader canManage={canManage} />

          {canManage ? <AgentInvites {...inviteContext} /> : null}

          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<AgentsSkeleton />}>
              <DataTable initialSettings={initialSettings} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </ScrollableContent>
    </HydrateClient>
  );
}
