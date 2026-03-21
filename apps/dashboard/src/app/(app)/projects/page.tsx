import { createPrismaClient } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import Link from "next/link";
import { requireOnboardedSession } from "../../../lib/session";
import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
} from "../../actions";

type ProjectsPageProps = {
  searchParams?: Promise<{ status?: string }>;
};

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "outline" | "secondary" | "destructive" }
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

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
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
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              Projects
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {stats.total} project{stats.total !== 1 ? "s" : ""}
              {stats.active > 0 ? ` · ${stats.active} active` : ""}
            </p>
          </div>
        </div>

        {/* Status filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            asChild
            size="sm"
            variant={!filterStatus ? "default" : "outline"}
          >
            <Link href="/projects">All ({stats.total})</Link>
          </Button>
          {(["draft", "active", "paused", "delayed", "completed", "archived"] as const).map(
            (s) => (
              <Button
                key={s}
                asChild
                size="sm"
                variant={filterStatus === s ? "default" : "outline"}
              >
                <Link href={`/projects?status=${s}`}>
                  {statusConfig[s]?.label ?? s} ({stats[s] ?? 0})
                </Link>
              </Button>
            ),
          )}
        </div>

        {/* Create Project Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create Project</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              action={createProjectAction}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <div>
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="e.g. Lekki Phase 2 Estate"
                />
              </div>
              <div>
                <Label htmlFor="code">Project Code</Label>
                <Input id="code" name="code" placeholder="e.g. LK-P2-001" />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  name="type"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="">Select type</option>
                  <option value="building">Building</option>
                  <option value="estate">Estate</option>
                  <option value="fit_out">Fit-out</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="renovation">Renovation</option>
                </select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. Lekki, Lagos"
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" />
              </div>
              <div>
                <Label htmlFor="targetCompletionDate">
                  Target Completion Date
                </Label>
                <Input
                  id="targetCompletionDate"
                  name="targetCompletionDate"
                  type="date"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Brief description of the project"
                />
              </div>
              <div className="sm:col-span-2">
                <SubmitButton loadingLabel="Creating…">
                  Create Project
                </SubmitButton>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Project List */}
        {projects.length === 0 ? (
          <Card className="py-16 text-center">
            <CardContent>
              <p className="text-muted-foreground">
                {filterStatus
                  ? `No ${statusConfig[filterStatus]?.label ?? filterStatus} projects.`
                  : "No projects yet. Create your first project above."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="bg-card">
                <CardHeader className="flex flex-row items-start justify-between gap-4 px-6 pt-5 pb-2">
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
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {project.code ? `${project.code} · ` : ""}
                      {project.location ?? "No location"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
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
                      <p className="mt-0.5 text-xs text-muted-foreground">
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
                  <div className="flex shrink-0 items-center gap-2">
                    {project.status === "draft" && (
                      <form action={updateProjectAction}>
                        <input
                          type="hidden"
                          name="projectId"
                          value={project.id}
                        />
                        <input type="hidden" name="status" value="active" />
                        <Button size="sm" type="submit" variant="default">
                          Activate
                        </Button>
                      </form>
                    )}
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/projects/${project.id}`}>View</Link>
                    </Button>
                    <form action={deleteProjectAction}>
                      <input
                        type="hidden"
                        name="projectId"
                        value={project.id}
                      />
                      <Button size="sm" type="submit" variant="destructive">
                        Delete
                      </Button>
                    </form>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
