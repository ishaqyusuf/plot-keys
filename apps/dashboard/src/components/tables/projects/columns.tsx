"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import type { inferRouterOutputs } from "@trpc/server";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  DeleteProjectButton,
  UpdateProjectStatusButton,
} from "@/components/projects/project-actions";
import {
  formatProjectDate,
  projectStatusConfig,
  projectTypeLabels,
} from "@/components/projects/project-utils";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type ProjectTableRow = RouterOutputs["projects"]["list"]["data"][number];

function ProjectCell({ project }: { project: ProjectTableRow }) {
  return (
    <div className="min-w-0 space-y-1">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <Link
          className="truncate text-sm font-medium text-foreground transition-colors hover:text-primary"
          href={`/projects/${project.id}`}
          onClick={(event) => event.stopPropagation()}
        >
          {project.name}
        </Link>
        <Badge variant={projectStatusConfig[project.status].variant}>
          {projectStatusConfig[project.status].label}
        </Badge>
        {project.type ? (
          <Badge variant="outline">
            {projectTypeLabels[project.type] ?? project.type}
          </Badge>
        ) : null}
      </div>
      <p className="truncate text-xs text-muted-foreground">
        {project.code ? `${project.code} - ` : ""}
        {project.location ?? "No location"}
      </p>
    </div>
  );
}

function ScopeCell({ project }: { project: ProjectTableRow }) {
  return (
    <p className="text-sm text-muted-foreground">
      {project._count.phases} phase{project._count.phases !== 1 ? "s" : ""},{" "}
      {project._count.milestones} milestone
      {project._count.milestones !== 1 ? "s" : ""},{" "}
      {project._count.issues} issue
      {project._count.issues !== 1 ? "s" : ""}
    </p>
  );
}

function TimelineCell({ project }: { project: ProjectTableRow }) {
  return (
    <div className="space-y-1 text-sm text-muted-foreground">
      <p>Start {formatProjectDate(project.startDate)}</p>
      <p>Target {formatProjectDate(project.targetCompletionDate)}</p>
    </div>
  );
}

function ActionsCell({ project }: { project: ProjectTableRow }) {
  return (
    <div
      className="flex flex-wrap justify-end gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      {project.status === "draft" ? (
        <UpdateProjectStatusButton
          label="Activate"
          projectId={project.id}
          status="active"
          variant="outline"
        />
      ) : null}
      <Button asChild size="sm" variant="outline">
        <Link href={`/projects/${project.id}`}>View</Link>
      </Button>
      <DeleteProjectButton projectId={project.id} />
    </div>
  );
}

export const columns: ColumnDef<ProjectTableRow>[] = [
  {
    accessorFn: (row) => row.name,
    cell: ({ row }) => <ProjectCell project={row.original} />,
    header: "Project",
    id: "project",
    meta: {
      className:
        "min-w-[320px] md:sticky md:left-0 md:z-20 md:bg-background",
      headerLabel: "Project",
      skeleton: { type: "text", width: "w-52" },
      sticky: true,
    },
    size: 360,
  },
  {
    cell: ({ row }) => <ScopeCell project={row.original} />,
    header: "Scope",
    id: "scope",
    meta: {
      className: "min-w-[260px]",
      headerLabel: "Scope",
      skeleton: { type: "text", width: "w-44" },
    },
    size: 300,
  },
  {
    cell: ({ row }) => <TimelineCell project={row.original} />,
    header: "Timeline",
    id: "timeline",
    meta: {
      className: "min-w-[220px]",
      headerLabel: "Timeline",
      skeleton: { type: "text", width: "w-36" },
    },
    size: 240,
  },
  {
    cell: ({ row }) => <ActionsCell project={row.original} />,
    header: "",
    id: "actions",
    meta: {
      className:
        "min-w-[300px] text-right md:sticky md:right-0 md:z-20 md:border-l md:border-border md:bg-background group-hover:bg-[#F2F1EF] group-hover:dark:bg-[#0f0f0f]",
      headerLabel: "Actions",
      skeleton: { type: "text", width: "w-28" },
      sticky: true,
    },
    size: 320,
  },
];
