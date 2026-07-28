"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { cn } from "@plotkeys/ui/cn";
import { Icon } from "@plotkeys/ui/icons";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { TableCell, TableHead, TableRow } from "@plotkeys/ui/table";
import type { inferRouterOutputs } from "@trpc/server";
import {
  budgetLineCategoryLabels,
  formatBudgetCurrency,
} from "@/components/projects/project-budget-utils";

type RouterOutputs = inferRouterOutputs<AppRouter>;
export type ProjectBudgetDetail = NonNullable<
  RouterOutputs["projects"]["getBudgetDetail"]
>;
export type ProjectBudget = ProjectBudgetDetail["budget"];
export type BudgetLineItem = NonNullable<ProjectBudget>["lineItems"][number];

const budgetLineItemHeaders = [
  { label: "Item" },
  { label: "Category" },
  { label: "Quantity" },
  { className: "text-right", label: "Estimated" },
  { className: "text-right", label: "Actual" },
  { className: "text-right", label: "Actions" },
];

export function BudgetLineItemTableHeader() {
  return (
    <TableRow className="border-border hover:bg-transparent">
      {budgetLineItemHeaders.map((header) => (
        <TableHead
          className={cn("h-10 border-b border-border px-3", header.className)}
          key={header.label}
        >
          {header.label}
        </TableHead>
      ))}
    </TableRow>
  );
}

export function BudgetLineItemRow({
  currency,
  isDeletePending,
  isDeleting,
  item,
  onDelete,
}: {
  currency: string;
  isDeletePending: boolean;
  isDeleting: boolean;
  item: BudgetLineItem;
  onDelete: (lineItemId: BudgetLineItem["id"]) => void;
}) {
  return (
    <TableRow className="group border-border bg-background hover:bg-muted">
      <TableCell className="max-w-[24rem] border-b border-border px-3 py-3 align-top">
        <div className="font-medium text-foreground">{item.description}</div>
        {item.notes ? (
          <div className="mt-1 text-xs text-muted-foreground">{item.notes}</div>
        ) : null}
      </TableCell>
      <TableCell className="border-b border-border px-3 py-3 align-top">
        <Badge variant="outline">
          {budgetLineCategoryLabels[item.category] ?? item.category}
        </Badge>
      </TableCell>
      <TableCell className="border-b border-border px-3 py-3 align-top text-sm text-muted-foreground">
        {item.quantity ?? "-"}
        {item.unitRateMinor != null ? (
          <span className="block text-xs">
            @ {formatBudgetCurrency(item.unitRateMinor, currency)}
          </span>
        ) : null}
      </TableCell>
      <TableCell className="border-b border-border px-3 py-3 text-right align-top">
        {formatBudgetCurrency(item.estimatedMinor, currency)}
      </TableCell>
      <TableCell className="border-b border-border px-3 py-3 text-right align-top">
        {formatBudgetCurrency(item.actualMinor, currency)}
      </TableCell>
      <TableCell className="border-b border-border px-3 py-3 text-right align-top">
        <SubmitButton
          disabled={isDeletePending}
          isSubmitting={isDeleting}
          onClick={() => onDelete(item.id)}
          size="sm"
          variant="ghost"
        >
          <Icon.Delete className="mr-2 size-4" />
          Remove
        </SubmitButton>
      </TableCell>
    </TableRow>
  );
}
