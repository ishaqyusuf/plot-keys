"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { cn } from "@plotkeys/ui/cn";
import { Icon } from "@plotkeys/ui/icons";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { TableCell, TableHead, TableRow } from "@plotkeys/ui/table";
import type { inferRouterOutputs } from "@trpc/server";
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
          className={cn("h-10 border-b border-border px-3", header.className)}
          key={header.label}
        >
          {header.label}
        </TableHead>
      ))}
    </TableRow>
  );
}

export function WorkerRow({
  isDeletePending,
  isDeleting,
  isUpdatePending,
  isUpdating,
  onDelete,
  onStatusChange,
  worker,
}: {
  isDeletePending: boolean;
  isDeleting: boolean;
  isUpdatePending: boolean;
  isUpdating: boolean;
  onDelete: (workerId: ProjectWorker["id"]) => void;
  onStatusChange: (
    workerId: ProjectWorker["id"],
    status: ProjectWorker["status"],
  ) => void;
  worker: ProjectWorker;
}) {
  return (
    <TableRow className="group border-border bg-background hover:bg-muted">
      <TableCell className="max-w-[24rem] border-b border-border px-3 py-3 align-top">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-foreground">{worker.fullName}</span>
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
      <TableCell className="border-b border-border px-3 py-3 align-top">
        <Badge variant="outline">
          {workerPayBasisLabels[worker.payBasis] ?? worker.payBasis}
        </Badge>
      </TableCell>
      <TableCell className="border-b border-border px-3 py-3 text-right align-top">
        {formatProjectCurrency(worker.payRateMinor)}
      </TableCell>
      <TableCell className="border-b border-border px-3 py-3 text-right align-top">
        <div className="flex justify-end gap-2">
          {worker.status === "active" ? (
            <SubmitButton
              disabled={isUpdatePending}
              isSubmitting={isUpdating}
              onClick={() => onStatusChange(worker.id, "inactive")}
              size="sm"
              variant="outline"
            >
              Deactivate
            </SubmitButton>
          ) : null}
          {worker.status === "inactive" ? (
            <SubmitButton
              disabled={isUpdatePending}
              isSubmitting={isUpdating}
              onClick={() => onStatusChange(worker.id, "active")}
              size="sm"
              variant="outline"
            >
              Reactivate
            </SubmitButton>
          ) : null}
          <SubmitButton
            disabled={isDeletePending}
            isSubmitting={isDeleting}
            onClick={() => onDelete(worker.id)}
            size="sm"
            variant="ghost"
          >
            <Icon.Delete className="mr-2 size-4" />
            Remove
          </SubmitButton>
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
          className={cn("h-10 border-b border-border px-3", header.className)}
          key={header.label}
        >
          {header.label}
        </TableHead>
      ))}
    </TableRow>
  );
}

export function PayrollRunRow({
  isUpdatePending,
  isUpdating,
  onStatusChange,
  run,
}: {
  isUpdatePending: boolean;
  isUpdating: boolean;
  onStatusChange: (
    payrollRunId: ProjectPayrollRun["id"],
    status: ProjectPayrollRun["status"],
  ) => void;
  run: ProjectPayrollRun;
}) {
  return (
    <TableRow className="group border-border bg-background hover:bg-muted">
      <TableCell className="border-b border-border px-3 py-3 align-top">
        <span className="font-medium text-foreground">
          {formatProjectDate(run.periodStart)} -{" "}
          {formatProjectDate(run.periodEnd)}
        </span>
      </TableCell>
      <TableCell className="border-b border-border px-3 py-3 align-top">
        <Badge
          variant={payrollRunStatusConfig[run.status]?.variant ?? "outline"}
        >
          {payrollRunStatusConfig[run.status]?.label ?? run.status}
        </Badge>
      </TableCell>
      <TableCell className="border-b border-border px-3 py-3 text-right align-top">
        {run._count.entries}
      </TableCell>
      <TableCell className="border-b border-border px-3 py-3 text-right align-top">
        {formatProjectCurrency(run.totalGrossMinor)}
      </TableCell>
      <TableCell className="border-b border-border px-3 py-3 text-right align-top">
        {formatProjectCurrency(run.totalNetMinor)}
      </TableCell>
      <TableCell className="border-b border-border px-3 py-3 text-right align-top">
        <div className="flex justify-end gap-2">
          {run.status === "draft" ? (
            <SubmitButton
              disabled={isUpdatePending}
              isSubmitting={isUpdating}
              onClick={() => onStatusChange(run.id, "finalized")}
              size="sm"
              variant="outline"
            >
              Finalize
            </SubmitButton>
          ) : null}
          {run.status === "finalized" ? (
            <SubmitButton
              disabled={isUpdatePending}
              isSubmitting={isUpdating}
              onClick={() => onStatusChange(run.id, "paid")}
              size="sm"
            >
              Mark paid
            </SubmitButton>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
}
