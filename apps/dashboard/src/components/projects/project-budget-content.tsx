"use client";

import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Table, TableBody, TableHeader } from "@plotkeys/ui/table";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CreateBudgetLineForm } from "@/components/forms/project-budget-line-form";
import {
  BudgetLineItemsEmptyState,
  ProjectBudgetNotFoundState,
} from "@/components/projects/project-budget-empty-states";
import {
  type BudgetLineItem,
  BudgetLineItemRow,
  BudgetLineItemTableHeader,
} from "@/components/projects/project-budget-line-items";
import { BudgetSummary } from "@/components/projects/project-budget-summary";
import { ProjectSection } from "@/components/projects/project-section";
import { ProjectSubpageHeader } from "@/components/projects/project-subpage-header";
import { useTRPC } from "@/trpc/client";

type Props = {
  projectId: string;
};

type LineItemListInput = {
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

export function ProjectBudgetContent({ projectId }: Props) {
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
      <ProjectSubpageHeader
        description={`Manage financial planning, BOQ line items, and budget structure for ${project.name}.`}
        projectId={projectId}
        title="Budget"
      />

      <ProjectSection
        description="Review approved, forecast, actual, and variance totals for this project."
        title="Budget summary"
      >
        <div className="border bg-background p-5">
          <BudgetSummary budget={budget} projectId={projectId} />
        </div>
      </ProjectSection>

      <section className="overflow-hidden border bg-background">
        <div className="border-b border-border px-5 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-sm font-medium text-foreground">
                Line items (BOQ)
              </h2>
              <p className="text-sm text-muted-foreground">
                Track estimated and actual spend by budget category.
              </p>
            </div>
            <Badge variant="outline">
              {budget?.lineItems.length ?? 0} items
            </Badge>
          </div>
        </div>
        <div>
          {budget && budget.lineItems.length > 0 ? (
            <BudgetLineItemList
              currency={currency}
              lineItems={budget.lineItems}
              projectId={projectId}
            />
          ) : (
            <BudgetLineItemsEmptyState />
          )}
        </div>
      </section>

      {budget ? (
        <ProjectSection
          description="Capture budget category, amount, quantity, and QS notes."
          title="Add line item"
        >
          <div className="border bg-background p-5">
            <CreateBudgetLineForm budgetId={budget.id} projectId={projectId} />
          </div>
        </ProjectSection>
      ) : null}
    </div>
  );
}

export function BudgetLineItemList({
  currency,
  lineItems,
  projectId,
}: LineItemListInput) {
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
    <div className="overflow-auto overscroll-contain border-x border-b border-border scrollbar-hide">
      {deleteMutation.error ? (
        <Alert variant="destructive" className="m-4">
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
              isDeletePending={deleteMutation.isPending}
              isDeleting={
                deleteMutation.isPending &&
                deleteMutation.variables?.lineItemId === item.id
              }
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
