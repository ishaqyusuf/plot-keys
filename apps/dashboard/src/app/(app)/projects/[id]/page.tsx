import { createPrismaClient } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOnboardedSession } from "../../../../lib/session";
import { UpdateProjectStatusButton } from "../../../../components/projects/project-actions";
import {
  BudgetLineItemList,
  BudgetSummary,
  CreateBudgetLineForm,
} from "../../../../components/projects/project-budget";
import {
  CustomerAccessList,
  GrantCustomerAccessForm,
  SendNoticeForm,
} from "../../../../components/projects/project-customer-access";
import { CreateIssueForm, IssueList } from "../../../../components/projects/project-issues";
import {
  CreateMilestoneForm,
  MilestoneList,
} from "../../../../components/projects/project-milestones";
import {
  CreatePayrollRunForm,
  PayrollRunList,
} from "../../../../components/projects/project-payroll";
import {
  CreatePhaseForm,
  PhaseList,
} from "../../../../components/projects/project-phases";
import {
  AssignMemberForm,
  TeamList,
} from "../../../../components/projects/project-team";
import {
  CreateUpdateForm,
  UpdatesList,
} from "../../../../components/projects/project-updates";
import {
  CreateWorkerForm,
  WorkerList,
} from "../../../../components/projects/project-workers";

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

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
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

  // Fetch budget data
  const budget = await prisma.projectBudget.findUnique({
    where: { projectId },
    include: {
      lineItems: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  // Fetch workers
  const workers = await prisma.projectWorker.findMany({
    where: { projectId },
    include: {
      employee: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Fetch payroll runs
  const payrollRuns = await prisma.projectPayrollRun.findMany({
    where: { projectId },
    include: {
      _count: { select: { entries: true } },
    },
    orderBy: { periodStart: "desc" },
  });

  // Fetch customer access records
  const customerAccess = await prisma.projectCustomerAccess.findMany({
    where: { projectId, disabledAt: null },
    include: {
      customer: {
        select: { id: true, name: true, email: true, phone: true, status: true },
      },
    },
    orderBy: { enabledAt: "desc" },
  });

  const grantedCustomerIds = new Set(
    customerAccess.map((a) => a.customerId),
  );

  // Fetch all company customers for the grant form
  const customers = await prisma.customer.findMany({
    where: { companyId, deletedAt: null },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

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
              <UpdateProjectStatusButton
                projectId={project.id}
                status="active"
                label="Activate"
              />
            )}
            {project.status === "active" && (
              <UpdateProjectStatusButton
                projectId={project.id}
                status="completed"
                label="Mark Complete"
                variant="secondary"
              />
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
              <PhaseList phases={project.phases} projectId={project.id} />
            )}
            <CreatePhaseForm
              projectId={project.id}
              nextOrder={project.phases.length}
            />
          </CardContent>
        </Card>

        {/* Milestones Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            {project.milestones.length > 0 && (
              <MilestoneList
                milestones={project.milestones}
                projectId={project.id}
              />
            )}
            <CreateMilestoneForm
              projectId={project.id}
              phases={project.phases}
            />
          </CardContent>
        </Card>

        {/* Updates Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Updates</CardTitle>
          </CardHeader>
          <CardContent>
            {project.updates.length > 0 && (
              <UpdatesList updates={project.updates} projectId={project.id} />
            )}
            <CreateUpdateForm projectId={project.id} />
          </CardContent>
        </Card>

        {/* Issues Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Issues</CardTitle>
          </CardHeader>
          <CardContent>
            {project.issues.length > 0 && (
              <IssueList issues={project.issues} projectId={project.id} />
            )}
            <CreateIssueForm projectId={project.id} />
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Team</CardTitle>
          </CardHeader>
          <CardContent>
            {project.assignments.length > 0 && (
              <TeamList assignments={project.assignments} />
            )}
            <AssignMemberForm
              projectId={project.id}
              teamMembers={teamMembers}
              assignedMemberIds={assignedMemberIds}
            />
          </CardContent>
        </Card>

        {/* Budget Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetSummary budget={budget} projectId={project.id} />
            {budget && budget.lineItems.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-semibold">Line Items</h4>
                <BudgetLineItemList
                  lineItems={budget.lineItems}
                  projectId={project.id}
                  currency={budget.currency}
                />
              </div>
            )}
            {budget && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-semibold">Add Line Item</h4>
                <CreateBudgetLineForm
                  projectId={project.id}
                  budgetId={budget.id}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workers Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Site Workers</CardTitle>
          </CardHeader>
          <CardContent>
            {workers.length > 0 && (
              <WorkerList workers={workers} projectId={project.id} />
            )}
            <CreateWorkerForm projectId={project.id} />
          </CardContent>
        </Card>

        {/* Payroll Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Project Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            {payrollRuns.length > 0 && (
              <PayrollRunList runs={payrollRuns} projectId={project.id} />
            )}
            <CreatePayrollRunForm projectId={project.id} />
          </CardContent>
        </Card>

        {/* Customer Access Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Customer Access</CardTitle>
          </CardHeader>
          <CardContent>
            {customerAccess.length > 0 && (
              <CustomerAccessList
                accessList={customerAccess}
                projectId={project.id}
              />
            )}
            <GrantCustomerAccessForm
              projectId={project.id}
              customers={customers}
              grantedCustomerIds={grantedCustomerIds}
            />
            {customerAccess.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-semibold">Send Notice</h4>
                <SendNoticeForm
                  projectId={project.id}
                  accessList={customerAccess}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
