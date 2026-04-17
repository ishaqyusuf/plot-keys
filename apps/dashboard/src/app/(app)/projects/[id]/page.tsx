import { createPrismaClient } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DashboardPage,
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
  DashboardStatGrid,
} from "../../../../components/dashboard/dashboard-page";
import { UpdateProjectStatusButton } from "../../../../components/projects/project-actions";
import { ProjectAiInsights } from "../../../../components/projects/project-ai";
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
import {
  CreateIssueForm,
  IssueList,
} from "../../../../components/projects/project-issues";
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
import { requireOnboardedSession } from "../../../../lib/session";

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
      phases: { orderBy: { order: "asc" } },
      milestones: {
        orderBy: { dueDate: "asc" },
        include: { phase: { select: { id: true, name: true } } },
      },
      updates: { orderBy: { postedAt: "desc" }, take: 10 },
      issues: { orderBy: { openedAt: "desc" } },
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

  if (!project) notFound();

  const teamMembers = await prisma.membership.findMany({
    where: { companyId, deletedAt: null, status: "active" },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  const assignedMemberIds = new Set(
    project.assignments.map((a) => a.membershipId),
  );

  const budget = await prisma.projectBudget.findUnique({
    where: { projectId },
    include: {
      lineItems: { orderBy: { createdAt: "asc" } },
    },
  });

  const workers = await prisma.projectWorker.findMany({
    where: { projectId },
    include: {
      employee: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const payrollRuns = await prisma.projectPayrollRun.findMany({
    where: { projectId },
    include: { _count: { select: { entries: true } } },
    orderBy: { periodStart: "desc" },
  });

  const customerAccess = await prisma.projectCustomerAccess.findMany({
    where: { projectId, disabledAt: null },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          status: true,
        },
      },
    },
    orderBy: { enabledAt: "desc" },
  });

  const grantedCustomerIds = new Set(
    customerAccess.map((access) => access.customerId),
  );

  const customers = await prisma.customer.findMany({
    where: { companyId, deletedAt: null },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Project workspace</DashboardPageEyebrow>
            <DashboardPageTitle>{project.name}</DashboardPageTitle>
            <DashboardPageDescription>
              {project.code ? `${project.code} · ` : ""}
              {project.location ?? "No location"}
              {project.type ? ` · ${project.type}` : ""}
              {project.startDate || project.targetCompletionDate
                ? ` · ${formatDate(project.startDate)} to ${formatDate(project.targetCompletionDate)}`
                : ""}
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <Badge variant={statusConfig[project.status]?.variant ?? "outline"}>
              {statusConfig[project.status]?.label ?? project.status}
            </Badge>
            {project.status === "draft" ? (
              <UpdateProjectStatusButton
                projectId={project.id}
                status="active"
                label="Activate"
              />
            ) : null}
            {project.status === "active" ? (
              <UpdateProjectStatusButton
                projectId={project.id}
                status="completed"
                label="Mark Complete"
                variant="secondary"
              />
            ) : null}
            <Button asChild variant="outline" size="sm">
              <Link href={`/projects/${project.id}/budget`}>Budget</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/projects/${project.id}/workforce`}>Workforce</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/projects">Back to projects</Link>
            </Button>
          </DashboardPageActions>
        </DashboardPageHeaderRow>
      </DashboardPageHeader>

      <DashboardStatGrid>
        {[
          { label: "Phases", value: project._count.phases },
          { label: "Milestones", value: project._count.milestones },
          { label: "Issues", value: project._count.issues },
          { label: "Team members", value: project._count.assignments },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/70 bg-card/82">
            <CardContent className="px-5 py-5">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </DashboardStatGrid>

      {[
        {
          title: "Phases",
          description: "Sequence the project roadmap into delivery stages.",
          content: (
            <>
              {project.phases.length > 0 ? (
                <PhaseList phases={project.phases} projectId={project.id} />
              ) : null}
              <CreatePhaseForm
                projectId={project.id}
                nextOrder={project.phases.length}
              />
            </>
          ),
        },
        {
          title: "Milestones",
          description: "Track key deadlines and deliverables across phases.",
          content: (
            <>
              {project.milestones.length > 0 ? (
                <MilestoneList
                  milestones={project.milestones}
                  projectId={project.id}
                />
              ) : null}
              <CreateMilestoneForm
                projectId={project.id}
                phases={project.phases}
              />
            </>
          ),
        },
        {
          title: "Updates",
          description:
            "Capture recent project movement and client-facing status notes.",
          content: (
            <>
              {project.updates.length > 0 ? (
                <UpdatesList updates={project.updates} projectId={project.id} />
              ) : null}
              <CreateUpdateForm projectId={project.id} />
            </>
          ),
        },
        {
          title: "Issues",
          description:
            "Document blockers, defects, and field issues that need action.",
          content: (
            <>
              {project.issues.length > 0 ? (
                <IssueList issues={project.issues} projectId={project.id} />
              ) : null}
              <CreateIssueForm projectId={project.id} />
            </>
          ),
        },
        {
          title: "Team",
          description: "Assign active members and review project ownership.",
          content: (
            <>
              {project.assignments.length > 0 ? (
                <TeamList assignments={project.assignments} />
              ) : null}
              <AssignMemberForm
                projectId={project.id}
                teamMembers={teamMembers}
                assignedMemberIds={assignedMemberIds}
              />
            </>
          ),
        },
        {
          title: "Budget",
          description: "Monitor spend, budget health, and current line items.",
          content: (
            <>
              <BudgetSummary budget={budget} projectId={project.id} />
              {budget && budget.lineItems.length > 0 ? (
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-semibold">Line items</h4>
                  <BudgetLineItemList
                    lineItems={budget.lineItems}
                    projectId={project.id}
                    currency={budget.currency}
                  />
                </div>
              ) : null}
              {budget ? (
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-semibold">Add line item</h4>
                  <CreateBudgetLineForm
                    projectId={project.id}
                    budgetId={budget.id}
                  />
                </div>
              ) : null}
            </>
          ),
        },
        {
          title: "Site workers",
          description:
            "Review assigned workers and keep labor details current.",
          content: (
            <>
              {workers.length > 0 ? (
                <WorkerList workers={workers} projectId={project.id} />
              ) : null}
              <CreateWorkerForm projectId={project.id} />
            </>
          ),
        },
        {
          title: "Project payroll",
          description: "Run payroll cycles tied directly to the project team.",
          content: (
            <>
              {payrollRuns.length > 0 ? (
                <PayrollRunList runs={payrollRuns} projectId={project.id} />
              ) : null}
              <CreatePayrollRunForm projectId={project.id} />
            </>
          ),
        },
        {
          title: "Customer access",
          description: "Grant stakeholders access and send delivery notices.",
          content: (
            <>
              {customerAccess.length > 0 ? (
                <CustomerAccessList
                  accessList={customerAccess}
                  projectId={project.id}
                />
              ) : null}
              <GrantCustomerAccessForm
                projectId={project.id}
                customers={customers}
                grantedCustomerIds={grantedCustomerIds}
              />
              {customerAccess.length > 0 ? (
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-semibold">Send notice</h4>
                  <SendNoticeForm
                    projectId={project.id}
                    accessList={customerAccess}
                  />
                </div>
              ) : null}
            </>
          ),
        },
      ].map((section) => (
        <DashboardSection key={section.title}>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>{section.title}</DashboardSectionTitle>
              <DashboardSectionDescription>
                {section.description}
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>
          <Card className="border-border/70 bg-card/82">
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>{section.content}</CardContent>
          </Card>
        </DashboardSection>
      ))}

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>AI insights</DashboardSectionTitle>
            <DashboardSectionDescription>
              Review model-generated observations for this project inside the
              shared dashboard flow.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <ProjectAiInsights projectId={project.id} />
      </DashboardSection>
    </DashboardPage>
  );
}
