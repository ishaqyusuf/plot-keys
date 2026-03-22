"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useTRPC } from "../../trpc/client";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatMinorCurrency(minor: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(minor / 100);
}

const payBasisLabel: Record<string, string> = {
  daily: "Daily",
  fixed_contract: "Fixed Contract",
  milestone_based: "Milestone",
  weekly: "Weekly",
};

const workerStatusConfig: Record<
  string,
  { label: string; variant: "default" | "outline" | "secondary" | "destructive" }
> = {
  active: { label: "Active", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
  off_project: { label: "Off Project", variant: "outline" },
};

// ---------------------------------------------------------------------------
// Worker list
// ---------------------------------------------------------------------------

type Worker = {
  id: string;
  fullName: string;
  role: string;
  payBasis: string;
  payRateMinor: number;
  currency: string;
  status: string;
  notes: string | null;
};

export function WorkerList({
  workers,
  projectId,
}: {
  workers: Worker[];
  projectId: string;
}) {
  const router = useRouter();
  const trpc = useTRPC();

  const updateMutation = useMutation(
    trpc.projects.updateWorker.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  const removeMutation = useMutation(
    trpc.projects.removeWorker.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  return (
    <div className="mb-4 space-y-2">
      {workers.map((worker) => (
        <div
          key={worker.id}
          className="flex items-center justify-between gap-4 rounded-md border p-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{worker.fullName}</span>
              <Badge
                variant={
                  workerStatusConfig[worker.status]?.variant ?? "outline"
                }
              >
                {workerStatusConfig[worker.status]?.label ?? worker.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {worker.role} ·{" "}
              {formatMinorCurrency(worker.payRateMinor, worker.currency)}{" "}
              {payBasisLabel[worker.payBasis] ?? worker.payBasis}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {worker.status === "active" && (
              <Button
                size="sm"
                variant="outline"
                disabled={updateMutation.isPending}
                onClick={() =>
                  updateMutation.mutate({
                    projectId,
                    workerId: worker.id,
                    status: "off_project",
                  })
                }
              >
                Off Project
              </Button>
            )}
            {worker.status === "off_project" && (
              <Button
                size="sm"
                variant="outline"
                disabled={updateMutation.isPending}
                onClick={() =>
                  updateMutation.mutate({
                    projectId,
                    workerId: worker.id,
                    status: "active",
                  })
                }
              >
                Reactivate
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:bg-destructive/10"
              disabled={removeMutation.isPending}
              onClick={() =>
                removeMutation.mutate({ projectId, workerId: worker.id })
              }
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add worker form
// ---------------------------------------------------------------------------

export function AddWorkerForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const trpc = useTRPC();

  const addMutation = useMutation(
    trpc.projects.addWorker.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("fullName") ?? "").trim();
    const role = String(fd.get("role") ?? "").trim();
    const payBasis = String(
      fd.get("payBasis") ?? "daily",
    ) as "daily" | "weekly" | "fixed_contract" | "milestone_based";
    const payRate = Number.parseInt(String(fd.get("payRate") ?? "0"), 10);

    if (!fullName || !role) return;

    await addMutation.mutateAsync({
      projectId,
      fullName,
      role,
      payBasis,
      payRateMinor: Number.isNaN(payRate) ? 0 : payRate * 100,
    });

    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="text-sm font-medium">Add Worker</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <Label htmlFor="workerName">Full Name</Label>
          <Input
            id="workerName"
            name="fullName"
            required
            placeholder="e.g. John Doe"
          />
        </div>
        <div>
          <Label htmlFor="workerRole">Role</Label>
          <Input
            id="workerRole"
            name="role"
            required
            placeholder="e.g. Mason"
          />
        </div>
        <div>
          <Label htmlFor="workerPayBasis">Pay Basis</Label>
          <select
            id="workerPayBasis"
            name="payBasis"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            defaultValue="daily"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="fixed_contract">Fixed Contract</option>
            <option value="milestone_based">Milestone</option>
          </select>
        </div>
        <div>
          <Label htmlFor="workerPayRate">Rate (₦)</Label>
          <Input
            id="workerPayRate"
            name="payRate"
            type="number"
            min={0}
            defaultValue={0}
            placeholder="0"
          />
        </div>
      </div>
      <Button disabled={addMutation.isPending} type="submit" size="sm">
        {addMutation.isPending ? "Adding…" : "Add Worker"}
      </Button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Payroll run list
// ---------------------------------------------------------------------------

type PayrollRun = {
  id: string;
  periodStart: Date;
  periodEnd: Date;
  status: string;
  totalGrossMinor: number;
  totalNetMinor: number;
  currency: string;
  _count: { entries: number };
};

const runStatusConfig: Record<
  string,
  { label: string; variant: "default" | "outline" | "secondary" | "destructive" }
> = {
  confirmed: { label: "Confirmed", variant: "secondary" },
  draft: { label: "Draft", variant: "outline" },
  paid: { label: "Paid", variant: "default" },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

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

  const deleteMutation = useMutation(
    trpc.projects.deletePayrollRun.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  if (runs.length === 0) {
    return (
      <p className="mb-4 text-sm text-muted-foreground">
        No payroll runs yet. Create one below.
      </p>
    );
  }

  return (
    <div className="mb-4 space-y-2">
      {runs.map((run) => (
        <div
          key={run.id}
          className="flex items-center justify-between gap-4 rounded-md border p-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {formatDate(run.periodStart)} → {formatDate(run.periodEnd)}
              </span>
              <Badge
                variant={
                  runStatusConfig[run.status]?.variant ?? "outline"
                }
              >
                {runStatusConfig[run.status]?.label ?? run.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {run._count.entries} workers ·{" "}
              Gross:{" "}
              {formatMinorCurrency(run.totalGrossMinor, run.currency)} ·{" "}
              Net: {formatMinorCurrency(run.totalNetMinor, run.currency)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {run.status === "draft" && (
              <Button
                size="sm"
                variant="outline"
                disabled={updateMutation.isPending}
                onClick={() =>
                  updateMutation.mutate({
                    projectId,
                    runId: run.id,
                    status: "confirmed",
                  })
                }
              >
                Confirm
              </Button>
            )}
            {run.status === "confirmed" && (
              <Button
                size="sm"
                variant="secondary"
                disabled={updateMutation.isPending}
                onClick={() =>
                  updateMutation.mutate({
                    projectId,
                    runId: run.id,
                    status: "paid",
                  })
                }
              >
                Mark Paid
              </Button>
            )}
            {run.status === "draft" && (
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10"
                disabled={deleteMutation.isPending}
                onClick={() =>
                  deleteMutation.mutate({ projectId, runId: run.id })
                }
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Create payroll run form
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
    <form onSubmit={onSubmit} className="flex items-end gap-3">
      <div>
        <Label htmlFor="periodStart">Period Start</Label>
        <Input
          id="periodStart"
          name="periodStart"
          type="date"
          required
        />
      </div>
      <div>
        <Label htmlFor="periodEnd">Period End</Label>
        <Input
          id="periodEnd"
          name="periodEnd"
          type="date"
          required
        />
      </div>
      <Button disabled={createMutation.isPending} type="submit" size="sm">
        {createMutation.isPending ? "Creating…" : "Create Run"}
      </Button>
    </form>
  );
}
