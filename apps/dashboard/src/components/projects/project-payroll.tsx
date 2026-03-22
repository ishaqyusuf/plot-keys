"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useTRPC } from "../../trpc/client";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const runStatusConfig: Record<
  string,
  { label: string; variant: "default" | "outline" | "secondary" | "destructive" }
> = {
  draft: { label: "Draft", variant: "outline" },
  finalized: { label: "Finalized", variant: "secondary" },
  paid: { label: "Paid", variant: "default" },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(minor: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(minor / 100);
}

function formatDate(date: Date | string | null) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PayrollRun = {
  id: string;
  periodStart: Date | string;
  periodEnd: Date | string;
  status: string;
  totalGrossMinor: number;
  totalNetMinor: number;
  _count: { entries: number };
};

// ---------------------------------------------------------------------------
// Payroll Runs list
// ---------------------------------------------------------------------------

export function PayrollRunList({
  runs,
  projectId,
}: {
  runs: PayrollRun[];
  projectId: string;
}) {
  const router = useRouter();
  const trpc = useTRPC();

  const updateMutation = useMutation(
    trpc.projects.updatePayrollRun.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  return (
    <div className="mb-4 space-y-2">
      {runs.map((run) => (
        <div
          key={run.id}
          className="flex items-center justify-between rounded-md border p-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {formatDate(run.periodStart)} – {formatDate(run.periodEnd)}
              </span>
              <Badge
                variant={runStatusConfig[run.status]?.variant ?? "outline"}
              >
                {runStatusConfig[run.status]?.label ?? run.status}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {run._count.entries} entries · Gross:{" "}
              {formatCurrency(run.totalGrossMinor)} · Net:{" "}
              {formatCurrency(run.totalNetMinor)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {run.status === "draft" && (
              <Button
                size="sm"
                variant="outline"
                disabled={updateMutation.isPending}
                onClick={() =>
                  updateMutation.mutate({
                    projectId,
                    payrollRunId: run.id,
                    status: "finalized",
                  })
                }
              >
                Finalize
              </Button>
            )}
            {run.status === "finalized" && (
              <Button
                size="sm"
                variant="default"
                disabled={updateMutation.isPending}
                onClick={() =>
                  updateMutation.mutate({
                    projectId,
                    payrollRunId: run.id,
                    status: "paid",
                  })
                }
              >
                Mark Paid
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Create Payroll Run form
// ---------------------------------------------------------------------------

export function CreatePayrollRunForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const trpc = useTRPC();

  const createMutation = useMutation(
    trpc.projects.createPayrollRun.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const periodStart = String(fd.get("periodStart") ?? "").trim();
    const periodEnd = String(fd.get("periodEnd") ?? "").trim();
    if (!periodStart || !periodEnd) return;

    await createMutation.mutateAsync({
      projectId,
      periodStart,
      periodEnd,
    });

    e.currentTarget.reset();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      <div>
        <Label htmlFor="payrollStart">Period Start *</Label>
        <Input id="payrollStart" name="periodStart" type="date" required />
      </div>
      <div>
        <Label htmlFor="payrollEnd">Period End *</Label>
        <Input id="payrollEnd" name="periodEnd" type="date" required />
      </div>
      <div className="sm:col-span-2">
        <Button disabled={createMutation.isPending} type="submit">
          {createMutation.isPending ? "Creating…" : "Create Payroll Run"}
        </Button>
      </div>
    </form>
  );
}
