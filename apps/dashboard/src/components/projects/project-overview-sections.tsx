"use client";

import type { AppRouter } from "@plotkeys/api/router";
import type { inferRouterOutputs } from "@trpc/server";
import { CreateBudgetLineForm } from "@/components/forms/project-budget-line-form";
import { CreatePayrollRunForm } from "@/components/forms/project-payroll-run-form";
import { CreateWorkerForm } from "@/components/forms/project-worker-form";
import { BudgetLineItemList } from "@/components/projects/project-budget-content";
import { BudgetSummary } from "@/components/projects/project-budget-summary";
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
  CreatePhaseForm,
  PhaseList,
} from "@/components/projects/project-phases";
import { ProjectSection } from "@/components/projects/project-section";
import { AssignMemberForm, TeamList } from "@/components/projects/project-team";
import {
  CreateUpdateForm,
  UpdatesList,
} from "@/components/projects/project-updates";
import {
  PayrollRunList,
  WorkerList,
} from "@/components/projects/project-workforce-content";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type ProjectOverviewDetail = NonNullable<
  RouterOutputs["projects"]["getOverviewDetail"]
>;

type Props = {
  detail: ProjectOverviewDetail;
};

export function ProjectOverviewSections({ detail }: Props) {
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
        <ProjectSection
          description={section.description}
          key={section.title}
          title={section.title}
        >
          <div className="border bg-background p-5">{section.content}</div>
        </ProjectSection>
      ))}
    </>
  );
}
