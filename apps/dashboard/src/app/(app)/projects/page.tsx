import { createPrismaClient } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { FolderKanban } from "lucide-react";
import Link from "next/link";
import { DashboardEmptyState } from "../../../components/dashboard/dashboard-empty-state";
import {
  DashboardFilterTab,
  DashboardFilterTabs,
  DashboardPage,
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardPageToolbar,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
  DashboardToolbarGroup,
} from "../../../components/dashboard/dashboard-page";
import { CreateProjectForm } from "../../../components/projects/create-project-form";
import {
  DeleteProjectButton,
  UpdateProjectStatusButton,
} from "../../../components/projects/project-actions";
import { requireOnboardedSession } from "../../../lib/session";

type ProjectsPageProps = {
  searchParams?: Promise<{ error?: string; status?: string }>;
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

const typeLabels: Record<string, string> = {
  building: "Building",
  estate: "Estate",
  fit_out: "Fit-out",
  infrastructure: "Infrastructure",
  renovation: "Renovation",
};

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const params = (await searchParams) ?? {};
  const filterStatus = params.status || undefined;

  const prisma = createPrismaClient().db;

  const [projects, counts] = await Promise.all([
    prisma
      ? prisma.project.findMany({
          where: {
            companyId,
            deletedAt: null,
            ...(filterStatus ? { status: filterStatus as never } : {}),
          },
          include: {
            _count: {
              select: {
                phases: true,
                milestones: true,
                updates: true,
                issues: true,
                assignments: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 200,
        })
      : [],
    prisma
      ? prisma.project.groupBy({
          by: ["status"],
          _count: true,
          where: { companyId, deletedAt: null },
        })
      : [],
  ]);

  const stats: Record<string, number> = {
    active: counts.find((c) => c.status === "active")?._count ?? 0,
    archived: counts.find((c) => c.status === "archived")?._count ?? 0,
    completed: counts.find((c) => c.status === "completed")?._count ?? 0,
    delayed: counts.find((c) => c.status === "delayed")?._count ?? 0,
    draft: counts.find((c) => c.status === "draft")?._count ?? 0,
    paused: counts.find((c) => c.status === "paused")?._count ?? 0,
    total: counts.reduce((sum, c) => sum + c._count, 0),
  };

  return (
    <DashboardPage>
      {params.error ? (
        <Alert variant="destructive">
          <AlertDescription>{params.error}</AlertDescription>
        </Alert>
      ) : null}

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
            <Button asChild variant="outline">
              <Link href="/reports">View reports</Link>
            </Button>
          </DashboardPageActions>
        </DashboardPageHeaderRow>

        <DashboardPageToolbar>
          <DashboardToolbarGroup className="text-sm text-muted-foreground">
            {stats.total} project{stats.total !== 1 ? "s" : ""}
            {(stats.active ?? 0) > 0 ? ` · ${stats.active ?? 0} active` : ""}
          </DashboardToolbarGroup>
          <DashboardToolbarGroup>
            <DashboardFilterTabs>
              <DashboardFilterTab active={!filterStatus} href="/projects">
                All ({stats.total})
              </DashboardFilterTab>
              {(
                [
                  "draft",
                  "active",
                  "paused",
                  "delayed",
                  "completed",
                  "archived",
                ] as const
              ).map((s) => (
                <DashboardFilterTab
                  key={s}
                  active={filterStatus === s}
                  href={`/projects?status=${s}`}
                >
                  {statusConfig[s]?.label ?? s} ({stats[s] ?? 0})
                </DashboardFilterTab>
              ))}
            </DashboardFilterTabs>
          </DashboardToolbarGroup>
        </DashboardPageToolbar>
      </DashboardPageHeader>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Create project</DashboardSectionTitle>
            <DashboardSectionDescription>
              Start a new delivery workflow with the same structure used across
              the dashboard.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>

        <Card className="border-border/65 bg-card/78">
          <CardHeader className="px-5 py-4">
            <CardTitle>Create Project</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <CreateProjectForm />
          </CardContent>
        </Card>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Project pipeline</DashboardSectionTitle>
            <DashboardSectionDescription>
              Review current work, move draft projects forward, and remove stale
              records.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>

        {projects.length === 0 ? (
          <DashboardEmptyState
            description={
              filterStatus
                ? `No ${statusConfig[filterStatus]?.label ?? filterStatus} projects yet.`
                : "No projects yet. Create your first project to start tracking delivery."
            }
            icon={<FolderKanban className="size-5" />}
            title="Nothing in the pipeline"
          />
        ) : (
          <div className="grid gap-2.5">
            {projects.map((project) => (
              <Card key={project.id} className="border-border/65 bg-card/78">
                <CardHeader className="flex flex-row items-start justify-between gap-4 px-5 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-semibold">
                        <Link
                          href={`/projects/${project.id}`}
                          className="hover:underline"
                        >
                          {project.name}
                        </Link>
                      </CardTitle>
                      <Badge
                        variant={
                          statusConfig[project.status]?.variant ?? "outline"
                        }
                      >
                        {statusConfig[project.status]?.label ?? project.status}
                      </Badge>
                      {project.type && (
                        <Badge variant="outline">
                          {typeLabels[project.type] ?? project.type}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {project.code ? `${project.code} · ` : ""}
                      {project.location ?? "No location"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {project._count.phases} phase
                      {project._count.phases !== 1 ? "s" : ""} ·{" "}
                      {project._count.milestones} milestone
                      {project._count.milestones !== 1 ? "s" : ""} ·{" "}
                      {project._count.issues} issue
                      {project._count.issues !== 1 ? "s" : ""} ·{" "}
                      {project._count.assignments} member
                      {project._count.assignments !== 1 ? "s" : ""}
                    </p>
                    {(project.startDate || project.targetCompletionDate) && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {project.startDate
                          ? `Start: ${formatDate(project.startDate)}`
                          : ""}
                        {project.startDate && project.targetCompletionDate
                          ? " → "
                          : ""}
                        {project.targetCompletionDate
                          ? `Target: ${formatDate(project.targetCompletionDate)}`
                          : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2 self-center">
                    {project.status === "draft" && (
                      <UpdateProjectStatusButton
                        projectId={project.id}
                        status="active"
                        label="Activate"
                      />
                    )}
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/projects/${project.id}`}>View</Link>
                    </Button>
                    <DeleteProjectButton projectId={project.id} />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </DashboardSection>
    </DashboardPage>
  );
}
