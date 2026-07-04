import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { buildDashboardUrl } from "@plotkeys/utils";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { AgentsTable } from "@/components/tables/agents";
import { AgentsSkeleton } from "@/components/tables/agents/skeleton";
import { loadSortParams } from "@/hooks/use-sort-params";
import { loadAgentsFilterParams } from "@/lib/agents-filter-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Agents | Plot Keys",
};

type AgentsPageProps = {
  searchParams?: Promise<
    SearchParams & {
      error?: string;
      invited?: string;
      q?: string;
      sort?: string | string[];
    }
  >;
};

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const currentUserRole = session.activeMembership.role;
  const canManage =
    currentUserRole === "owner" ||
    currentUserRole === "admin" ||
    currentUserRole === "platform_admin";
  const isDevMode = process.env.NODE_ENV === "development";
  const appBaseUrl = buildDashboardUrl();
  const filters = loadAgentsFilterParams(params);
  const { sort } = loadSortParams(params);
  const listInput = { q: filters.q, sort };
  const initialSettings = await getInitialTableSettings("agents");

  batchPrefetch([
    trpc.workspace.listAgents.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
    ...(canManage ? [trpc.team.listInvites.queryOptions()] : []),
  ]);

  return (
    <DashboardPage>
      {params.error ? (
        <Alert variant="destructive">
          <AlertDescription>{params.error}</AlertDescription>
        </Alert>
      ) : null}

      {params.invited ? (
        <Alert>
          <AlertDescription>
            Agent invite sent. They&apos;ll receive an email to join and fill in
            their profile directly.
          </AlertDescription>
        </Alert>
      ) : null}

      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<AgentsSkeleton />}>
            <AgentsTable
              appBaseUrl={appBaseUrl}
              canManage={canManage}
              initialSettings={initialSettings}
              isDevMode={isDevMode}
            />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
