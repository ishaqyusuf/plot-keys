import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { buildDashboardUrl } from "@plotkeys/utils";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { TeamsTable } from "@/components/tables/teams";
import { TeamsSkeleton } from "@/components/tables/teams/skeleton";
import { loadSortParams } from "@/hooks/use-sort-params";
import { requireOnboardedSession } from "@/lib/session";
import { loadTeamFilterParams } from "@/lib/team-filter-params";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Team | Plot Keys",
};

type TeamPageProps = {
  searchParams?: Promise<
    SearchParams & {
      error?: string;
      invited?: string;
      q?: string;
      sort?: string | string[];
    }
  >;
};

export default async function TeamPage({ searchParams }: TeamPageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const currentUserId = session.user.id;
  const currentUserRole = session.activeMembership.role;
  const canInvite =
    currentUserRole === "owner" ||
    currentUserRole === "admin" ||
    currentUserRole === "platform_admin";
  const isDevMode = process.env.NODE_ENV === "development";
  const appBaseUrl = buildDashboardUrl();
  const filters = loadTeamFilterParams(params);
  const { sort } = loadSortParams(params);
  const listInput = { q: filters.q, sort };
  const initialSettings = await getInitialTableSettings("team");

  batchPrefetch([
    trpc.team.getOverview.queryOptions(),
    trpc.team.listMembers.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
    ...(canInvite ? [trpc.team.listInvites.queryOptions()] : []),
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
            Invite sent! The recipient will receive a link to join.
          </AlertDescription>
        </Alert>
      ) : null}

      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<TeamsSkeleton />}>
            <TeamsTable
              appBaseUrl={appBaseUrl}
              canInvite={canInvite}
              currentUserId={currentUserId}
              initialSettings={initialSettings}
              isDevMode={isDevMode}
            />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
