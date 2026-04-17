import { createPrismaClient } from "@plotkeys/db";
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
} from "../../../../../components/dashboard/dashboard-page";
import {
  BudgetLineItemList,
  BudgetSummary,
  CreateBudgetLineForm,
} from "../../../../../components/projects/project-budget";
import { requireOnboardedSession } from "../../../../../lib/session";

type BudgetPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectBudgetPage({ params }: BudgetPageProps) {
  const { id: projectId } = await params;
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;

  const prisma = createPrismaClient().db;
  if (!prisma) throw new Error("Database not configured.");

  const project = await prisma.project.findFirst({
    where: { id: projectId, companyId, deletedAt: null },
    select: { id: true, name: true },
  });

  if (!project) notFound();

  const budget = await prisma.projectBudget.findUnique({
    where: { projectId },
    include: {
      lineItems: { orderBy: { createdAt: "asc" } },
    },
  });

  const currency = budget?.currency ?? "NGN";

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Project workspace</DashboardPageEyebrow>
            <DashboardPageTitle>Budget</DashboardPageTitle>
            <DashboardPageDescription>
              Manage financial planning, BOQ line items, and budget structure
              for {project.name}.
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <Button asChild size="sm" variant="outline">
              <Link href={`/projects/${projectId}`}>Back to project</Link>
            </Button>
          </DashboardPageActions>
        </DashboardPageHeaderRow>
      </DashboardPageHeader>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Budget summary</DashboardSectionTitle>
            <DashboardSectionDescription>
              Review totals and keep the project budget anchored to the new
              dashboard surface system.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <Card className="border-border/70 bg-card/82">
          <CardHeader>
            <CardTitle>Budget summary</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetSummary budget={budget} projectId={projectId} />
          </CardContent>
        </Card>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Line items</DashboardSectionTitle>
            <DashboardSectionDescription>
              Track the BOQ and add new items within the same compact project
              workflow.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <Card className="border-border/70 bg-card/82">
          <CardHeader>
            <CardTitle>Line items (BOQ)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {budget && budget.lineItems.length > 0 ? (
              <BudgetLineItemList
                lineItems={budget.lineItems}
                projectId={projectId}
                currency={currency}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                No line items yet.
              </p>
            )}
            {budget ? (
              <CreateBudgetLineForm
                projectId={projectId}
                budgetId={budget.id}
              />
            ) : null}
          </CardContent>
        </Card>
      </DashboardSection>
    </DashboardPage>
  );
}
