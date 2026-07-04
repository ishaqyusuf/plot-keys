"use client";

import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback, useDeferredValue, useMemo } from "react";
import { DashboardTablePage } from "@/components/dashboard/dashboard-page";
import {
  isProjectStatus,
  type ProjectStatus,
} from "@/components/projects/project-utils";
import { useProjectsFilterParams } from "@/hooks/use-projects-filter-params";
import { useSortParams } from "@/hooks/use-sort-params";
import { useTRPC } from "@/trpc/client";
import type { TableSettings } from "@/utils/table-settings";
import { ProjectsEmptyState, ProjectsNoResults } from "./empty-states";
import { ProjectsDataTable } from "./table";
import { ProjectsPageHeader } from "./table-header";

type ProjectsTableProps = {
  initialSettings?: Partial<TableSettings>;
};

export function ProjectsTable({ initialSettings }: ProjectsTableProps) {
  const trpc = useTRPC();
  const { filters, hasFilters, setFilters } = useProjectsFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filters.q);
  const statusParam = filters.status ?? undefined;
  const activeStatus: ProjectStatus | undefined = isProjectStatus(statusParam)
    ? statusParam
    : undefined;
  const listInput = {
    q: deferredSearch,
    sort: params.sort,
    status: activeStatus,
  };
  const { data: stats } = useSuspenseQuery(trpc.projects.stats.queryOptions());
  const infiniteQueryOptions = trpc.projects.list.infiniteQueryOptions(
    listInput,
    {
      getNextPageParam: ({ meta }) => meta?.cursor,
    },
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const projects = useMemo(
    () => data.pages.flatMap((page) => page.data),
    [data],
  );
  const fetchMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);
  const projectCount = data.pages[0]?.meta.count ?? projects.length;

  return (
    <div className="flex flex-col gap-5">
      <ProjectsPageHeader activeStatus={activeStatus} stats={stats} />

      {projects.length ? (
        <DashboardTablePage>
          <ProjectsDataTable
            fetchNextPage={fetchMore}
            hasNextPage={Boolean(hasNextPage)}
            initialSettings={initialSettings}
            isFetchingNextPage={isFetchingNextPage}
            projectCount={projectCount}
            projects={projects}
          />
        </DashboardTablePage>
      ) : hasFilters ? (
        <ProjectsNoResults onClear={() => setFilters(null)} />
      ) : (
        <ProjectsEmptyState activeStatus={activeStatus} />
      )}
    </div>
  );
}
