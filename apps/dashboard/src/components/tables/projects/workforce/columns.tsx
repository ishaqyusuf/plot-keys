"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { TableCell, TableHead, TableRow } from "@plotkeys/ui/table";
import { cn } from "@plotkeys/utils";
import type { inferRouterOutputs } from "@trpc/server";
import { Trash2Icon } from "lucide-react";
import {
  formatProjectCurrency,
  formatProjectDate,
  payrollRunStatusConfig,
  workerPayBasisLabels,
  workerStatusConfig,
} from "@/components/projects/project-workforce-utils";

type RouterOutputs = inferRouterOutputs<AppRouter>;
export type ProjectWorkforceDetail = NonNullable<
  RouterOutputs["projects"]["getWorkforceDetail"]
>;
export type ProjectWorker = ProjectWorkforceDetail["workers"][number];
export type ProjectPayrollRun = ProjectWorkforceDetail["payrollRuns"][number];

const workerHeaders = [
  { label: "Worker" },
  { label: "Pay basis" },
  { className: "text-right", label: "Rate" },
  { className: "text-right", label: "Actions" },
];

const payrollRunHeaders = [
  { label: "Period" },
  { label: "Status" },
  { className: "text-right", label: "Entries" },
  { className: "text-right", label: "Gross" },
  { className: "text-right", label: "Net" },
  { className: "text-right", label: "Actions" },
];

export function WorkerTableHeader() {
  return (
    <TableRow className="border-border hover:bg-transparent">
      {workerHeaders.map((header) => (
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

export function WorkerRow({
  isDeleting,
  isUpdating,
  onDelete,
  onStatusChange,
  worker,
}: {
  isDeleting: boolean;
  isUpdating: boolean;
  onDelete: (workerId: ProjectWorker["id"]) => void;
  onStatusChange: (
    workerId: ProjectWorker["id"],
    status: ProjectWorker["status"],
  ) => void;
  worker: ProjectWorker;
}) {
  return (
    <TableRow className="group border-border/70 bg-background hover:bg-muted/35">
      <TableCell className="max-w-[24rem] border-b border-border/70 px-3 py-3 align-top">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-foreground">
            {worker.fullName}
          </span>
          <Badge
            variant={workerStatusConfig[worker.status]?.variant ?? "outline"}
          >
            {workerStatusConfig[worker.status]?.label ?? worker.status}
          </Badge>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {worker.role ?? "No role set"}
          {worker.employee ? ` - Employee: ${worker.employee.name}` : ""}
        </div>
      </TableCell>
      <TableCell className="border-b border-border/70 px-3 py-3 align-top">
        <Badge variant="outline">
          {workerPayBasisLabels[worker.payBasis] ?? worker.payBasis}
        </Badge>
      </TableCell>
      <TableCell className="border-b border-border/70 px-3 py-3 text-right align-top">
        {formatProjectCurrency(worker.payRateMinor)}
      </TableCell>
      <TableCell className="border-b border-border/70 px-3 py-3 text-right align-top">
        <div className="flex justify-end gap-2">
          {worker.status === "active" ? (
            <Button
              disabled={isUpdating}
              onClick={() => onStatusChange(worker.id, "inactive")}
              size="sm"
              type="button"
              variant="outline"
            >
              Deactivate
            </Button>
          ) : null}
          {worker.status === "inactive" ? (
            <Button
              disabled={isUpdating}
              onClick={() => onStatusChange(worker.id, "active")}
              size="sm"
              type="button"
              variant="outline"
            >
              Reactivate
            </Button>
          ) : null}
          <Button
            disabled={isDeleting}
            onClick={() => onDelete(worker.id)}
            size="sm"
            type="button"
            variant="ghost"
          >
            <Trash2Icon className="mr-2 size-4" />
            Remove
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function PayrollRunTableHeader() {
  return (
    <TableRow className="border-border hover:bg-transparent">
      {payrollRunHeaders.map((header) => (
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

export function PayrollRunRow({
  isUpdating,
  onStatusChange,
  run,
}: {
  isUpdating: boolean;
  onStatusChange: (
    payrollRunId: ProjectPayrollRun["id"],
    status: ProjectPayrollRun["status"],
  ) => void;
  run: ProjectPayrollRun;
}) {
  return (
    <TableRow className="group border-border/70 bg-background hover:bg-muted/35">
      <TableCell className="border-b border-border/70 px-3 py-3 align-top">
        <span className="font-medium text-foreground">
          {formatProjectDate(run.periodStart)} -{" "}
          {formatProjectDate(run.periodEnd)}
        </span>
      </TableCell>
      <TableCell className="border-b border-border/70 px-3 py-3 align-top">
        <Badge
          variant={payrollRunStatusConfig[run.status]?.variant ?? "outline"}
        >
          {payrollRunStatusConfig[run.status]?.label ?? run.status}
        </Badge>
      </TableCell>
      <TableCell className="border-b border-border/70 px-3 py-3 text-right align-top">
        {run._count.entries}
      </TableCell>
      <TableCell className="border-b border-border/70 px-3 py-3 text-right align-top">
        {formatProjectCurrency(run.totalGrossMinor)}
      </TableCell>
      <TableCell className="border-b border-border/70 px-3 py-3 text-right align-top">
        {formatProjectCurrency(run.totalNetMinor)}
      </TableCell>
      <TableCell className="border-b border-border/70 px-3 py-3 text-right align-top">
        <div className="flex justify-end gap-2">
          {run.status === "draft" ? (
            <Button
              disabled={isUpdating}
              onClick={() => onStatusChange(run.id, "finalized")}
              size="sm"
              type="button"
              variant="outline"
            >
              Finalize
            </Button>
          ) : null}
          {run.status === "finalized" ? (
            <Button
              disabled={isUpdating}
              onClick={() => onStatusChange(run.id, "paid")}
              size="sm"
              type="button"
            >
              Mark paid
            </Button>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
}
