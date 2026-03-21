import { createPrismaClient } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOnboardedSession } from "../../../../lib/session";
import {
  assignProjectMemberAction,
  createProjectIssueAction,
  createProjectMilestoneAction,
  createProjectPhaseAction,
  createProjectUpdateAction,
  updateProjectAction,
  updateProjectIssueAction,
  updateProjectMilestoneAction,
  updateProjectPhaseAction,
} from "../../../actions";

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
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

const phaseStatusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  }
> = {
  completed: { label: "Completed", variant: "default" },
  in_progress: { label: "In Progress", variant: "secondary" },
  not_started: { label: "Not Started", variant: "outline" },
  on_hold: { label: "On Hold", variant: "destructive" },
};

const milestoneStatusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  }
> = {
  completed: { label: "Completed", variant: "default" },
  in_progress: { label: "In Progress", variant: "secondary" },
  overdue: { label: "Overdue", variant: "destructive" },
  pending: { label: "Pending", variant: "outline" },
};

const issueStatusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  }
> = {
  closed: { label: "Closed", variant: "outline" },
  in_progress: { label: "In Progress", variant: "secondary" },
  open: { label: "Open", variant: "destructive" },
  resolved: { label: "Resolved", variant: "default" },
};

const severityConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  }
> = {
  critical: { label: "Critical", variant: "destructive" },
  high: { label: "High", variant: "destructive" },
  low: { label: "Low", variant: "outline" },
  medium: { label: "Medium", variant: "secondary" },
};

const updateKindLabels: Record<string, string> = {
  daily: "Daily",
  general: "General",
  milestone: "Milestone",
  weekly: "Weekly",
};

const roleLabels: Record<string, string> = {
  finance_reviewer: "Finance Reviewer",
  project_manager: "Project Manager",
  project_owner: "Project Owner",
  qs_manager: "QS Manager",
  site_supervisor: "Site Supervisor",
  viewer: "Viewer",
};

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id: projectId } = await params;
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;

  const prisma = createPrismaClient().db;
  if (!prisma) throw new Error("Database not configured.");

  const project = await prisma.project.findFirst({
    where: { id: projectId, companyId, deletedAt: null },
    include: {
      phases: {
        orderBy: { order: "asc" },
      },
      milestones: {
        orderBy: { dueDate: "asc" },
        include: { phase: { select: { id: true, name: true } } },
      },
      updates: {
        orderBy: { postedAt: "desc" },
        take: 10,
      },
      issues: {
        orderBy: { openedAt: "desc" },
      },
      assignments: {
        where: { status: "active" },
        include: {
          membership: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      },
      _count: {
        select: {
          phases: true,
          milestones: true,
          documents: true,
          updates: true,
          issues: true,
          assignments: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  // Fetch team members for assignment form
  const teamMembers = await prisma.membership.findMany({
    where: { companyId, deletedAt: null, status: "active" },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  const assignedMemberIds = new Set(
    project.assignments.map((a) => a.membershipId),
  );

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-3xl font-semibold text-foreground">
                {project.name}
              </h1>
              <Badge
                variant={statusConfig[project.status]?.variant ?? "outline"}
              >
                {statusConfig[project.status]?.label ?? project.status}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {project.code ? `${project.code} · ` : ""}
              {project.location ?? "No location"}
              {project.type ? ` · ${project.type}` : ""}
            </p>
            {project.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {project.description}
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {project.startDate
                ? `Start: ${formatDate(project.startDate)}`
                : ""}
              {project.startDate && project.targetCompletionDate ? " → " : ""}
              {project.targetCompletionDate
                ? `Target: ${formatDate(project.targetCompletionDate)}`
                : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {project.status === "draft" && (
              <form action={updateProjectAction}>
                <input type="hidden" name="projectId" value={project.id} />
                <input type="hidden" name="status" value="active" />
                <Button size="sm" type="submit">
                  Activate
                </Button>
              </form>
            )}
            {project.status === "active" && (
              <form action={updateProjectAction}>
                <input type="hidden" name="projectId" value={project.id} />
                <input type="hidden" name="status" value="completed" />
                <Button size="sm" type="submit" variant="secondary">
                  Mark Complete
                </Button>
              </form>
            )}
            <Button asChild variant="outline" size="sm">
              <Link href="/projects">← Projects</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{project._count.phases}</p>
              <p className="text-xs text-muted-foreground">Phases</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{project._count.milestones}</p>
              <p className="text-xs text-muted-foreground">Milestones</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{project._count.issues}</p>
              <p className="text-xs text-muted-foreground">Issues</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">
                {project._count.assignments}
              </p>
              <p className="text-xs text-muted-foreground">Team Members</p>
            </CardContent>
          </Card>
        </div>

        {/* Phases Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Phases</CardTitle>
          </CardHeader>
          <CardContent>
            {project.phases.length > 0 && (
              <div className="mb-4 space-y-2">
                {project.phases.map((phase) => (
                  <div
                    key={phase.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{phase.name}</span>
                      <Badge
                        variant={
                          phaseStatusConfig[phase.status]?.variant ?? "outline"
                        }
                      >
                        {phaseStatusConfig[phase.status]?.label ?? phase.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {phase.status === "not_started" && (
                        <form action={updateProjectPhaseAction}>
                          <input
                            type="hidden"
                            name="phaseId"
                            value={phase.id}
                          />
                          <input
                            type="hidden"
                            name="projectId"
                            value={project.id}
                          />
                          <input
                            type="hidden"
                            name="status"
                            value="in_progress"
                          />
                          <Button size="sm" type="submit" variant="outline">
                            Start
                          </Button>
                        </form>
                      )}
                      {phase.status === "in_progress" && (
                        <form action={updateProjectPhaseAction}>
                          <input
                            type="hidden"
                            name="phaseId"
                            value={phase.id}
                          />
                          <input
                            type="hidden"
                            name="projectId"
                            value={project.id}
                          />
                          <input
                            type="hidden"
                            name="status"
                            value="completed"
                          />
                          <Button size="sm" type="submit" variant="outline">
                            Complete
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <form
              action={createProjectPhaseAction}
              className="flex items-end gap-2"
            >
              <input type="hidden" name="projectId" value={project.id} />
              <div className="flex-1">
                <Label htmlFor="phaseName">Add Phase</Label>
                <Input
                  id="phaseName"
                  name="name"
                  required
                  placeholder="e.g. Foundation"
                />
              </div>
              <div className="w-20">
                <Label htmlFor="phaseOrder">Order</Label>
                <Input
                  id="phaseOrder"
                  name="order"
                  type="number"
                  defaultValue={project.phases.length}
                />
              </div>
              <SubmitButton loadingLabel="Adding…">Add</SubmitButton>
            </form>
          </CardContent>
        </Card>

        {/* Milestones Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            {project.milestones.length > 0 && (
              <div className="mb-4 space-y-2">
                {project.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {milestone.name}
                        </span>
                        <Badge
                          variant={
                            milestoneStatusConfig[milestone.status]?.variant ??
                            "outline"
                          }
                        >
                          {milestoneStatusConfig[milestone.status]?.label ??
                            milestone.status}
                        </Badge>
                        {milestone.phase && (
                          <Badge variant="outline">
                            {milestone.phase.name}
                          </Badge>
                        )}
                      </div>
                      {milestone.dueDate && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Due: {formatDate(milestone.dueDate)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {milestone.status === "pending" && (
                        <form action={updateProjectMilestoneAction}>
                          <input
                            type="hidden"
                            name="milestoneId"
                            value={milestone.id}
                          />
                          <input
                            type="hidden"
                            name="projectId"
                            value={project.id}
                          />
                          <input
                            type="hidden"
                            name="status"
                            value="completed"
                          />
                          <Button size="sm" type="submit" variant="outline">
                            Complete
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <form
              action={createProjectMilestoneAction}
              className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
              <input type="hidden" name="projectId" value={project.id} />
              <div>
                <Label htmlFor="milestoneName">Add Milestone</Label>
                <Input
                  id="milestoneName"
                  name="name"
                  required
                  placeholder="e.g. Foundation complete"
                />
              </div>
              <div>
                <Label htmlFor="milestoneDueDate">Due Date</Label>
                <Input id="milestoneDueDate" name="dueDate" type="date" />
              </div>
              <div>
                <Label htmlFor="milestonePhase">Phase</Label>
                <select
                  id="milestonePhase"
                  name="phaseId"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="">No phase</option>
                  {project.phases.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-3">
                <SubmitButton loadingLabel="Adding…">
                  Add Milestone
                </SubmitButton>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Updates Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Updates</CardTitle>
          </CardHeader>
          <CardContent>
            {project.updates.length > 0 && (
              <div className="mb-4 space-y-3">
                {project.updates.map((update) => (
                  <div key={update.id} className="rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {updateKindLabels[update.kind] ?? update.kind}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(update.postedAt)}
                      </span>
                      {update.progressPercent != null && (
                        <Badge variant="secondary">
                          {update.progressPercent}%
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium">
                      {update.summary}
                    </p>
                    {update.details && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {update.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            <form
              action={createProjectUpdateAction}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              <input type="hidden" name="projectId" value={project.id} />
              <div>
                <Label htmlFor="updateSummary">Summary *</Label>
                <Input
                  id="updateSummary"
                  name="summary"
                  required
                  placeholder="What happened?"
                />
              </div>
              <div>
                <Label htmlFor="updateKind">Type</Label>
                <select
                  id="updateKind"
                  name="kind"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="general">General</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="milestone">Milestone</option>
                </select>
              </div>
              <div>
                <Label htmlFor="updateDetails">Details</Label>
                <Input
                  id="updateDetails"
                  name="details"
                  placeholder="Additional notes"
                />
              </div>
              <div>
                <Label htmlFor="updateProgress">Progress %</Label>
                <Input
                  id="updateProgress"
                  name="progressPercent"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0-100"
                />
              </div>
              <div className="sm:col-span-2">
                <SubmitButton loadingLabel="Posting…">
                  Post Update
                </SubmitButton>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Issues Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Issues</CardTitle>
          </CardHeader>
          <CardContent>
            {project.issues.length > 0 && (
              <div className="mb-4 space-y-2">
                {project.issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {issue.title}
                        </span>
                        <Badge
                          variant={
                            issueStatusConfig[issue.status]?.variant ??
                            "outline"
                          }
                        >
                          {issueStatusConfig[issue.status]?.label ??
                            issue.status}
                        </Badge>
                        <Badge
                          variant={
                            severityConfig[issue.severity]?.variant ?? "outline"
                          }
                        >
                          {severityConfig[issue.severity]?.label ??
                            issue.severity}
                        </Badge>
                      </div>
                      {issue.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {issue.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {issue.status === "open" && (
                        <form action={updateProjectIssueAction}>
                          <input
                            type="hidden"
                            name="issueId"
                            value={issue.id}
                          />
                          <input
                            type="hidden"
                            name="projectId"
                            value={project.id}
                          />
                          <input
                            type="hidden"
                            name="status"
                            value="resolved"
                          />
                          <Button size="sm" type="submit" variant="outline">
                            Resolve
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <form
              action={createProjectIssueAction}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              <input type="hidden" name="projectId" value={project.id} />
              <div>
                <Label htmlFor="issueTitle">Title *</Label>
                <Input
                  id="issueTitle"
                  name="title"
                  required
                  placeholder="Issue title"
                />
              </div>
              <div>
                <Label htmlFor="issueSeverity">Severity</Label>
                <select
                  id="issueSeverity"
                  name="severity"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="issueDesc">Description</Label>
                <Input
                  id="issueDesc"
                  name="description"
                  placeholder="Details about the issue"
                />
              </div>
              <div className="sm:col-span-2">
                <SubmitButton loadingLabel="Reporting…">
                  Report Issue
                </SubmitButton>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Team</CardTitle>
          </CardHeader>
          <CardContent>
            {project.assignments.length > 0 && (
              <div className="mb-4 space-y-2">
                {project.assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {assignment.membership.user.name ??
                          assignment.membership.user.email}
                      </span>
                      <Badge variant="outline">
                        {roleLabels[assignment.projectRole] ?? assignment.projectRole}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {teamMembers.filter((m) => !assignedMemberIds.has(m.id)).length >
              0 && (
              <form
                action={assignProjectMemberAction}
                className="flex items-end gap-2"
              >
                <input type="hidden" name="projectId" value={project.id} />
                <div className="flex-1">
                  <Label htmlFor="membershipId">Assign Member</Label>
                  <select
                    id="membershipId"
                    name="membershipId"
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                  >
                    <option value="">Select member</option>
                    {teamMembers
                      .filter((m) => !assignedMemberIds.has(m.id))
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.user.name ?? m.user.email}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="w-48">
                  <Label htmlFor="projectRole">Role</Label>
                  <select
                    id="projectRole"
                    name="projectRole"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="site_supervisor">Site Supervisor</option>
                    <option value="project_manager">Project Manager</option>
                    <option value="project_owner">Project Owner</option>
                    <option value="qs_manager">QS Manager</option>
                    <option value="finance_reviewer">Finance Reviewer</option>
                  </select>
                </div>
                <SubmitButton loadingLabel="Assigning…">Assign</SubmitButton>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
