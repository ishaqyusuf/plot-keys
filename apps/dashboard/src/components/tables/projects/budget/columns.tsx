"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { TableCell, TableHead, TableRow } from "@plotkeys/ui/table";
import { cn } from "@plotkeys/utils";
import type { inferRouterOutputs } from "@trpc/server";
import { Trash2Icon } from "lucide-react";
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
          className={cn(
            "h-10 border-b border-border/70 px-3",
            header.className,
          )}
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
  isDeleting,
  item,
  onDelete,
}: {
  currency: string;
  isDeleting: boolean;
  item: BudgetLineItem;
  onDelete: (lineItemId: BudgetLineItem["id"]) => void;
}) {
  return (
    <TableRow className="group border-border/70 bg-background hover:bg-muted/35">
      <TableCell className="max-w-[24rem] border-b border-border/70 px-3 py-3 align-top">
        <div className="font-medium text-foreground">{item.description}</div>
        {item.notes ? (
          <div className="mt-1 text-xs text-muted-foreground">
            {item.notes}
          </div>
        ) : null}
      </TableCell>
      <TableCell className="border-b border-border/70 px-3 py-3 align-top">
        <Badge variant="outline">
          {budgetLineCategoryLabels[item.category] ?? item.category}
        </Badge>
      </TableCell>
      <TableCell className="border-b border-border/70 px-3 py-3 align-top text-sm text-muted-foreground">
        {item.quantity ?? "-"}
        {item.unitRateMinor != null ? (
          <span className="block text-xs">
            @ {formatBudgetCurrency(item.unitRateMinor, currency)}
          </span>
        ) : null}
      </TableCell>
      <TableCell className="border-b border-border/70 px-3 py-3 text-right align-top">
        {formatBudgetCurrency(item.estimatedMinor, currency)}
      </TableCell>
      <TableCell className="border-b border-border/70 px-3 py-3 text-right align-top">
        {formatBudgetCurrency(item.actualMinor, currency)}
      </TableCell>
      <TableCell className="border-b border-border/70 px-3 py-3 text-right align-top">
        <Button
          disabled={isDeleting}
          onClick={() => onDelete(item.id)}
          size="sm"
          type="button"
          variant="ghost"
        >
          <Trash2Icon className="mr-2 size-4" />
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
}
