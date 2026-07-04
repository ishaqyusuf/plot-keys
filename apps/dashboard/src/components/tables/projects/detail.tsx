"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import type { inferRouterOutputs } from "@trpc/server";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FolderKanban } from "lucide-react";
import Link from "next/link";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import {
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
} from "@/components/dashboard/dashboard-page";
import { UpdateProjectStatusButton } from "@/components/projects/project-actions";
import { ProjectAiInsights } from "@/components/projects/project-ai";
import {
  BudgetLineItemList,
  BudgetSummary,
  CreateBudgetLineForm,
} from "@/components/projects/project-budget";
import {
  CustomerAccessList,
  GrantCustomerAccessForm,
  SendNoticeForm,
} from "@/components/projects/project-customer-access";
import {
  CreateIssueForm,
  IssueList,
} from "@/components/projects/project-issues";
import {
  CreateMilestoneForm,
  MilestoneList,
} from "@/components/projects/project-milestones";
import {
  CreatePayrollRunForm,
  PayrollRunList,
} from "@/components/projects/project-payroll";
import {
  CreatePhaseForm,
  PhaseList,
} from "@/components/projects/project-phases";
import {
  AssignMemberForm,
  TeamList,
} from "@/components/projects/project-team";
import {
  CreateUpdateForm,
  UpdatesList,
} from "@/components/projects/project-updates";
import {
  CreateWorkerForm,
  WorkerList,
} from "@/components/projects/project-workers";
import { useTRPC } from "@/trpc/client";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type ProjectOverviewDetail = NonNullable<
  RouterOutputs["projects"]["getOverviewDetail"]
>;

type ProjectDetailTableProps = {
  projectId: string;
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

function ProjectOverviewSections({
  detail,
}: {
  detail: ProjectOverviewDetail;
}) {
  const {
    budget,
    customerAccess,
    customers,
    payrollRuns,
    project,
    teamMembers,
    workers,
  } = detail;
  const assignedMemberIds = new Set(
    project.assignments.map((assignment) => assignment.membershipId),
  );
  const grantedCustomerIds = new Set(
    customerAccess.map((access) => access.customerId),
  );
  const sections = [
    {
      content: (
        <>
          {project.phases.length > 0 ? (
            <PhaseList phases={project.phases} projectId={project.id} />
          ) : null}
          <CreatePhaseForm
            nextOrder={project.phases.length}
            projectId={project.id}
          />
        </>
      ),
      description: "Sequence the project roadmap into delivery stages.",
      title: "Phases",
    },
    {
      content: (
        <>
          {project.milestones.length > 0 ? (
            <MilestoneList
              milestones={project.milestones}
              projectId={project.id}
            />
          ) : null}
          <CreateMilestoneForm phases={project.phases} projectId={project.id} />
        </>
      ),
      description: "Track key deadlines and deliverables across phases.",
      title: "Milestones",
    },
    {
      content: (
        <>
          {project.updates.length > 0 ? (
            <UpdatesList updates={project.updates} projectId={project.id} />
          ) : null}
          <CreateUpdateForm projectId={project.id} />
        </>
      ),
      description:
        "Capture recent project movement and client-facing status notes.",
      title: "Updates",
    },
    {
      content: (
        <>
          {project.issues.length > 0 ? (
            <IssueList issues={project.issues} projectId={project.id} />
          ) : null}
          <CreateIssueForm projectId={project.id} />
        </>
      ),
      description:
        "Document blockers, defects, and field issues that need action.",
      title: "Issues",
    },
    {
      content: (
        <>
          {project.assignments.length > 0 ? (
            <TeamList assignments={project.assignments} />
          ) : null}
          <AssignMemberForm
            assignedMemberIds={assignedMemberIds}
            projectId={project.id}
            teamMembers={teamMembers}
          />
        </>
      ),
      description: "Assign active members and review project ownership.",
      title: "Team",
    },
    {
      content: (
        <>
          <BudgetSummary budget={budget} projectId={project.id} />
          {budget && budget.lineItems.length > 0 ? (
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-semibold">Line items</h4>
              <BudgetLineItemList
                currency={budget.currency}
                lineItems={budget.lineItems}
                projectId={project.id}
              />
            </div>
          ) : null}
          {budget ? (
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-semibold">Add line item</h4>
              <CreateBudgetLineForm
                budgetId={budget.id}
                projectId={project.id}
              />
            </div>
          ) : null}
        </>
      ),
      description: "Monitor spend, budget health, and current line items.",
      title: "Budget",
    },
    {
      content: (
        <>
          {workers.length > 0 ? (
            <WorkerList projectId={project.id} workers={workers} />
          ) : null}
          <CreateWorkerForm projectId={project.id} />
        </>
      ),
      description: "Review assigned workers and keep labor details current.",
      title: "Site workers",
    },
    {
      content: (
        <>
          {payrollRuns.length > 0 ? (
            <PayrollRunList projectId={project.id} runs={payrollRuns} />
          ) : null}
          <CreatePayrollRunForm projectId={project.id} />
        </>
      ),
      description: "Run payroll cycles tied directly to the project team.",
      title: "Project payroll",
    },
    {
      content: (
        <>
          {customerAccess.length > 0 ? (
            <CustomerAccessList
              accessList={customerAccess}
              projectId={project.id}
            />
          ) : null}
          <GrantCustomerAccessForm
            customers={customers}
            grantedCustomerIds={grantedCustomerIds}
            projectId={project.id}
          />
          {customerAccess.length > 0 ? (
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-semibold">Send notice</h4>
              <SendNoticeForm
                accessList={customerAccess}
                projectId={project.id}
              />
            </div>
          ) : null}
        </>
      ),
      description: "Grant stakeholders access and send delivery notices.",
      title: "Customer access",
    },
  ];

  return (
    <>
      {sections.map((section) => (
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
    </>
  );
}

export function ProjectDetailTable({ projectId }: ProjectDetailTableProps) {
  const trpc = useTRPC();
  const { data: detail } = useSuspenseQuery(
    trpc.projects.getOverviewDetail.queryOptions({ projectId }),
  );

  if (!detail) {
    return (
      <DashboardEmptyState
        actions={
          <Button asChild>
            <Link href="/projects">Back to projects</Link>
          </Button>
        }
        description="This project may have been deleted, archived outside this workspace, or opened from an old link."
        icon={<FolderKanban className="size-5" />}
        title="Project not found"
      />
    );
  }

  const { project } = detail;

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Project workspace</DashboardPageEyebrow>
            <DashboardPageTitle>{project.name}</DashboardPageTitle>
            <DashboardPageDescription>
              {project.code ? `${project.code} - ` : ""}
              {project.location ?? "No location"}
              {project.type ? ` - ${project.type}` : ""}
              {project.startDate || project.targetCompletionDate
                ? ` - ${formatDate(project.startDate)} to ${formatDate(
                    project.targetCompletionDate,
                  )}`
                : ""}
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
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
            <Button asChild size="sm" variant="outline">
              <Link href={`/projects/${project.id}/budget`}>Budget</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/projects/${project.id}/workforce`}>Workforce</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
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
          <Card className="border-border/70 bg-card/82" key={stat.label}>
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

      <ProjectOverviewSections detail={detail} />

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
    </div>
  );
}
