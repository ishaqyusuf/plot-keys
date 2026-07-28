"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { HeaderLinkTab, HeaderLinkTabList } from "@/components/header-link-tab";
import {
  isProjectStatus,
  type ProjectStatus,
  projectStatusConfig,
  projectStatuses,
} from "@/components/projects/project-utils";
import { useProjectsFilterParams } from "@/hooks/use-projects-filter-params";
import { useTRPC } from "@/trpc/client";

export function ProjectsStatusTabs() {
  const trpc = useTRPC();
  const { data: stats } = useSuspenseQuery(trpc.projects.stats.queryOptions());
  const { filter } = useProjectsFilterParams();
  const statusParam = filter.status ?? undefined;
  const activeStatus = isProjectStatus(statusParam) ? statusParam : undefined;

  return (
    <HeaderLinkTabList>
      <HeaderLinkTab active={!activeStatus} href="/projects">
        All ({stats.total})
      </HeaderLinkTab>
      {projectStatuses.map((status) => (
        <HeaderLinkTab
          active={activeStatus === status}
          href={getStatusHref(status)}
          key={status}
        >
          {projectStatusConfig[status].label} ({stats[status] ?? 0})
        </HeaderLinkTab>
      ))}
    </HeaderLinkTabList>
  );
}

function getStatusHref(status: ProjectStatus) {
  return `/projects?status=${status}`;
}
