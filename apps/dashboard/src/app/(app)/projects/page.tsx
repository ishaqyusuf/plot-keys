import type { Metadata } from "next";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { isProjectStatus } from "@/components/projects/project-utils";
import { ProjectsTable } from "@/components/tables/projects";
import { ProjectsSkeleton } from "@/components/tables/projects/skeleton";
import { loadSortParams } from "@/hooks/use-sort-params";
import { loadProjectsFilterParams } from "@/lib/projects-filter-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Projects | Plot Keys",
};

type ProjectsPageProps = {
  searchParams?: Promise<
    SearchParams & {
      error?: string;
      q?: string;
      sort?: string | string[];
      status?: string;
    }
  >;
};

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const filters = loadProjectsFilterParams(params);
  const { sort } = loadSortParams(params);
  const statusParam = filters.status ?? undefined;
  const status = isProjectStatus(statusParam) ? statusParam : undefined;
  const listInput = { q: filters.q, sort, status };
  const initialSettings = await getInitialTableSettings("projects");

  batchPrefetch([
    trpc.projects.stats.queryOptions(),
    trpc.projects.list.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
  ]);

  return (
    <DashboardPage>
      {params.error ? (
        <Alert variant="destructive">
          <AlertDescription>{params.error}</AlertDescription>
        </Alert>
      ) : null}
      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<ProjectsSkeleton />}>
            <ProjectsTable initialSettings={initialSettings} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
