import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import { UpdateProjectStatusButton } from "@/components/projects/project-actions";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type ProjectOverviewDetail = NonNullable<
  RouterOutputs["projects"]["getOverviewDetail"]
>;

type Props = {
  project: ProjectOverviewDetail["project"];
};

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  }
> = {
  active: { label: "Active", variant: "default" },
  archived: { label: "Archived", variant: "outline" },
  completed: { label: "Completed", variant: "secondary" },
  delayed: { label: "Delayed", variant: "destructive" },
  draft: { label: "Draft", variant: "outline" },
  paused: { label: "Paused", variant: "secondary" },
};

function formatDate(date: Date | string | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(typeof date === "string" ? new Date(date) : date);
}

export function ProjectDetailHeader({ project }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-muted-foreground">
          Project workspace
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          {project.name}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {project.code ? `${project.code} - ` : ""}
          {project.location ?? "No location"}
          {project.type ? ` - ${project.type}` : ""}
          {project.startDate || project.targetCompletionDate
            ? ` - ${formatDate(project.startDate)} to ${formatDate(
                project.targetCompletionDate,
              )}`
            : ""}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={statusConfig[project.status]?.variant ?? "outline"}>
          {statusConfig[project.status]?.label ?? project.status}
        </Badge>
        {project.status === "draft" ? (
          <UpdateProjectStatusButton
            label="Activate"
            projectId={project.id}
            status="active"
          />
        ) : null}
        {project.status === "active" ? (
          <UpdateProjectStatusButton
            label="Mark complete"
            projectId={project.id}
            status="completed"
            variant="secondary"
          />
        ) : null}
        <Button variant="outline" size="sm" asChild>
          <Link href={`/projects/${project.id}/budget`}>Budget</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/projects/${project.id}/workforce`}>Workforce</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/projects">Back to projects</Link>
        </Button>
      </div>
    </div>
  );
}
