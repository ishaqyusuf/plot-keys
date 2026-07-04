"use client";

import { Button } from "@plotkeys/ui/button";
import Link from "next/link";
import {
  DashboardFilterTab,
  DashboardFilterTabs,
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardPageToolbar,
  DashboardTableFilters,
  DashboardTableHeaderTop,
  DashboardTablePageDescription,
  DashboardTablePageHeader,
  DashboardTablePageTitle,
  DashboardToolbarGroup,
} from "@/components/dashboard/dashboard-page";
import { ProjectsColumnVisibility } from "@/components/projects-column-visibility";
import { ProjectSheet } from "@/components/sheets/project-sheet";
import { ProjectsSearchFilter } from "./search-filter";
import {
  projectStatuses,
  projectStatusConfig,
  type ProjectStatus,
} from "@/components/projects/project-utils";

type ProjectStats = Record<ProjectStatus | "total", number>;

type ProjectsPageHeaderProps = {
  activeStatus?: ProjectStatus;
  stats: ProjectStats;
};

type ProjectsTableHeaderProps = {
  projectCount: number;
};

export function ProjectsPageHeader({
  activeStatus,
  stats,
}: ProjectsPageHeaderProps) {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>Delivery workspace</DashboardPageEyebrow>
          <DashboardPageTitle>Projects</DashboardPageTitle>
          <DashboardPageDescription>
            Manage delivery pipelines, staffing, issues, and milestones from a
            single operational view.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          <Button asChild size="sm" variant="outline">
            <Link href="/reports">View reports</Link>
          </Button>
          <ProjectSheet />
        </DashboardPageActions>
      </DashboardPageHeaderRow>

      <DashboardPageToolbar>
        <DashboardToolbarGroup className="text-sm text-muted-foreground">
          {stats.total} project{stats.total !== 1 ? "s" : ""}
          {(stats.active ?? 0) > 0 ? ` - ${stats.active ?? 0} active` : ""}
        </DashboardToolbarGroup>
        <DashboardToolbarGroup>
          <DashboardFilterTabs>
            <DashboardFilterTab active={!activeStatus} href="/projects">
              All ({stats.total})
            </DashboardFilterTab>
            {projectStatuses.map((status) => (
              <DashboardFilterTab
                active={activeStatus === status}
                href={`/projects?status=${status}`}
                key={status}
              >
                {projectStatusConfig[status].label} ({stats[status] ?? 0})
              </DashboardFilterTab>
            ))}
          </DashboardFilterTabs>
        </DashboardToolbarGroup>
      </DashboardPageToolbar>
    </DashboardPageHeader>
  );
}

export function ProjectsTableHeader({ projectCount }: ProjectsTableHeaderProps) {
  return (
    <DashboardTablePageHeader>
      <DashboardTableHeaderTop>
        <div>
          <DashboardTablePageTitle>Project pipeline</DashboardTablePageTitle>
          <DashboardTablePageDescription>
            Review current work, open delivery records, and move draft projects
            forward.
          </DashboardTablePageDescription>
        </div>
        <DashboardPageActions>
          <ProjectsColumnVisibility />
        </DashboardPageActions>
      </DashboardTableHeaderTop>

      <DashboardTableFilters>
        <ProjectsSearchFilter />
        <span className="text-sm text-muted-foreground">
          {projectCount} total
        </span>
      </DashboardTableFilters>
    </DashboardTablePageHeader>
  );
}
