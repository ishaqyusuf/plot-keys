"use client";

import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Table, TableBody, TableHeader } from "@plotkeys/ui/table";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  DashboardTablePage,
  DashboardTablePageBody,
  DashboardTablePageDescription,
  DashboardTablePageHeader,
  DashboardTablePageTitle,
} from "@/components/dashboard/dashboard-page";
import { CreateBudgetLineForm } from "@/components/forms/project-budget-line-form";
import { ProjectBudgetSummaryForm } from "@/components/forms/project-budget-summary-form";
import { useTRPC } from "@/trpc/client";
import {
  BudgetLineItemRow,
  BudgetLineItemTableHeader,
  type BudgetLineItem,
  type ProjectBudget,
} from "./budget/columns";
import {
  BudgetLineItemsEmptyState,
  ProjectBudgetNotFoundState,
} from "./budget/empty-states";
import { formatBudgetCurrency } from "@/components/projects/project-budget-utils";

type ProjectBudgetTableProps = {
  projectId: string;
};

type BudgetSummaryProps = {
  budget: ProjectBudget;
  projectId: string;
};

type BudgetLineItemListProps = {
  currency: string;
  lineItems: BudgetLineItem[];
  projectId: string;
};

function useInvalidateProjectBudget(projectId: string) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return async function invalidateProjectBudget() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.projects.getOverviewDetail.queryKey({ projectId }),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.projects.getBudgetDetail.queryKey({ projectId }),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.projects.getBudget.queryKey({ projectId }),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.projects.get.queryKey({ projectId }),
      }),
    ]);
    router.refresh();
  };
}

export function ProjectBudgetTable({ projectId }: ProjectBudgetTableProps) {
  const trpc = useTRPC();
  const { data: detail } = useSuspenseQuery(
    trpc.projects.getBudgetDetail.queryOptions({ projectId }),
  );

  if (!detail) {
    return <ProjectBudgetNotFoundState />;
  }

  const { budget, project } = detail;
  const currency = budget?.currency ?? "NGN";

  return (
    <div className="flex flex-col gap-6">
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
              Review approved, forecast, actual, and variance totals for this
              project.
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

      <DashboardTablePage>
        <DashboardTablePageHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <DashboardTablePageTitle>
                Line items (BOQ)
              </DashboardTablePageTitle>
              <DashboardTablePageDescription>
                Track estimated and actual spend by budget category.
              </DashboardTablePageDescription>
            </div>
            <Badge variant="outline">
              {budget?.lineItems.length ?? 0} items
            </Badge>
          </div>
        </DashboardTablePageHeader>
        <DashboardTablePageBody>
          {budget && budget.lineItems.length > 0 ? (
            <BudgetLineItemList
              currency={currency}
              lineItems={budget.lineItems}
              projectId={projectId}
            />
          ) : (
            <BudgetLineItemsEmptyState />
          )}
        </DashboardTablePageBody>
      </DashboardTablePage>

      {budget ? (
        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Add line item</DashboardSectionTitle>
              <DashboardSectionDescription>
                Capture budget category, amount, quantity, and QS notes.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>
          <Card className="border-border/70 bg-card/82">
            <CardHeader>
              <CardTitle>New BOQ item</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateBudgetLineForm
                budgetId={budget.id}
                projectId={projectId}
              />
            </CardContent>
          </Card>
        </DashboardSection>
      ) : null}
    </div>
  );
}

export function BudgetSummary({ budget, projectId }: BudgetSummaryProps) {
  if (!budget) {
    return <ProjectBudgetSummaryForm projectId={projectId} />;
  }

  const variance = budget.approvedBudgetMinor - budget.actualBudgetMinor;
  const lineEstimatedTotal = budget.lineItems.reduce(
    (total, item) => total + item.estimatedMinor,
    0,
  );
  const lineActualTotal = budget.lineItems.reduce(
    (total, item) => total + item.actualMinor,
    0,
  );

  return (
    <div className="space-y-4">
      <DashboardStatGrid>
        <div className="rounded-lg border border-border/60 bg-background/50 p-3">
          <p className="text-xs text-muted-foreground">Approved</p>
          <p className="text-lg font-bold">
            {formatBudgetCurrency(budget.approvedBudgetMinor, budget.currency)}
          </p>
        </div>
        <div className="rounded-lg border border-border/60 bg-background/50 p-3">
          <p className="text-xs text-muted-foreground">Forecast</p>
          <p className="text-lg font-bold">
            {formatBudgetCurrency(budget.forecastBudgetMinor, budget.currency)}
          </p>
        </div>
        <div className="rounded-lg border border-border/60 bg-background/50 p-3">
          <p className="text-xs text-muted-foreground">Actual</p>
          <p className="text-lg font-bold">
            {formatBudgetCurrency(budget.actualBudgetMinor, budget.currency)}
          </p>
        </div>
        <div className="rounded-lg border border-border/60 bg-background/50 p-3">
          <p className="text-xs text-muted-foreground">Variance</p>
          <p
            className={
              variance >= 0
                ? "text-lg font-bold text-green-600"
                : "text-lg font-bold text-red-600"
            }
          >
            {formatBudgetCurrency(variance, budget.currency)}
          </p>
        </div>
      </DashboardStatGrid>

      {budget.lineItems.length > 0 ? (
        <p className="text-xs text-muted-foreground">
          Line items: {formatBudgetCurrency(lineEstimatedTotal, budget.currency)}{" "}
          estimated / {formatBudgetCurrency(lineActualTotal, budget.currency)}{" "}
          actual
        </p>
      ) : null}
    </div>
  );
}

export function BudgetLineItemList({
  currency,
  lineItems,
  projectId,
}: BudgetLineItemListProps) {
  const trpc = useTRPC();
  const invalidateProjectBudget = useInvalidateProjectBudget(projectId);
  const deleteMutation = useMutation(
    trpc.projects.deleteBudgetLine.mutationOptions({
      onSuccess: invalidateProjectBudget,
    }),
  );
  const handleDelete = (lineItemId: BudgetLineItem["id"]) => {
    deleteMutation.mutate({
      lineItemId,
      projectId,
    });
  };

  return (
    <div className="overflow-auto overscroll-contain border-border border-x border-b scrollbar-hide">
      {deleteMutation.error ? (
        <Alert className="m-4" variant="destructive">
          <AlertDescription>{deleteMutation.error.message}</AlertDescription>
        </Alert>
      ) : null}

      <Table className="min-w-full">
        <TableHeader className="bg-background">
          <BudgetLineItemTableHeader />
        </TableHeader>
        <TableBody>
          {lineItems.map((item) => (
            <BudgetLineItemRow
              currency={currency}
              isDeleting={deleteMutation.isPending}
              item={item}
              key={item.id}
              onDelete={handleDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
