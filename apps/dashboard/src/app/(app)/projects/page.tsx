import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorFallback } from "@/components/error-fallback";
import { ProjectsHeader } from "@/components/projects-header";
import { ScrollableContent } from "@/components/scrollable-content";
import { DataTable } from "@/components/tables/projects/data-table";
import { ProjectsSkeleton } from "@/components/tables/projects/skeleton";
import {
  loadProjectsFilterParams,
  resolveProjectsListInput,
} from "@/hooks/use-projects-filter-params";
import { loadSortParams } from "@/hooks/use-sort-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Projects | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function ProjectsPage({ searchParams }: Props) {
  await requireOnboardedSession();
  const params = await searchParams;
  const filters = loadProjectsFilterParams(params);
  const { sort } = loadSortParams(params);
  const listInput = resolveProjectsListInput(filters, sort);
  const initialSettings = await getInitialTableSettings("projects");

  batchPrefetch([
    trpc.projects.stats.queryOptions(),
    trpc.projects.list.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
  ]);

  return (
    <HydrateClient>
      <ScrollableContent>
        <div className="flex flex-col gap-6">
          <ProjectsHeader />

          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<ProjectsSkeleton />}>
              <DataTable initialSettings={initialSettings} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </ScrollableContent>
    </HydrateClient>
  );
}
