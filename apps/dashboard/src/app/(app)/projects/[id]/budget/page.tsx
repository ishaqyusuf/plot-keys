import { createPrismaClient } from "@plotkeys/db";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireOnboardedSession } from "../../../../../lib/session";
import {
  AddBudgetLineItemForm,
  BudgetLineItemList,
  BudgetSummaryCard,
} from "../../../../../components/projects/project-budget";

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

  if (!project) {
    notFound();
  }

  const budget = await prisma.projectBudget.findUnique({
    where: { projectId },
    include: {
      lineItems: { orderBy: { createdAt: "asc" } },
    },
  });

  const currency = budget?.currency ?? "NGN";

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              Budget
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{project.name}</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${projectId}`}>← Back to Project</Link>
          </Button>
        </div>

        {/* Budget Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Budget Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetSummaryCard
              budget={budget}
              projectId={projectId}
            />
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Line Items (BOQ)</CardTitle>
          </CardHeader>
          <CardContent>
            {budget && budget.lineItems.length > 0 ? (
              <BudgetLineItemList
                lineItems={budget.lineItems}
                projectId={projectId}
                currency={currency}
              />
            ) : (
              <p className="mb-4 text-sm text-muted-foreground">
                No line items yet.
              </p>
            )}
            <AddBudgetLineItemForm projectId={projectId} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
