"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { NativeSelect, NativeSelectOption } from "@plotkeys/ui/native-select";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useTRPC } from "../../trpc/client";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const payBasisLabels: Record<string, string> = {
  daily: "Daily",
  fixed_contract: "Fixed Contract",
  milestone_based: "Milestone",
  monthly: "Monthly",
  weekly: "Weekly",
};

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  }
> = {
  active: { label: "Active", variant: "default" },
  inactive: { label: "Inactive", variant: "secondary" },
  terminated: { label: "Terminated", variant: "destructive" },
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Worker = {
  id: string;
  fullName: string;
  role: string | null;
  payBasis: string;
  payRateMinor: number;
  status: string;
  employee: { id: string; name: string; email: string | null } | null;
};

// ---------------------------------------------------------------------------
// Worker list
// ---------------------------------------------------------------------------

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

  const deleteMutation = useMutation(
    trpc.projects.deleteWorker.mutationOptions({
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
          className="flex items-center justify-between rounded-xl border border-border/65 bg-card/74 p-3.5"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{worker.fullName}</span>
              <Badge
                variant={statusConfig[worker.status]?.variant ?? "outline"}
              >
                {statusConfig[worker.status]?.label ?? worker.status}
              </Badge>
              <Badge variant="outline">
                {payBasisLabels[worker.payBasis] ?? worker.payBasis}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {worker.role ? `${worker.role} · ` : ""}
              Rate: {formatCurrency(worker.payRateMinor)}
              {worker.employee ? ` · Employee: ${worker.employee.name}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {worker.status === "active" && (
              <Button
                size="sm"
                variant="outline"
                disabled={updateMutation.isPending}
                onClick={() =>
                  updateMutation.mutate({
                    projectId,
                    workerId: worker.id,
                    status: "inactive",
                  })
                }
              >
                Deactivate
              </Button>
            )}
            {worker.status === "inactive" && (
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
              disabled={deleteMutation.isPending}
              onClick={() =>
                deleteMutation.mutate({ projectId, workerId: worker.id })
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
// Create Worker form
// ---------------------------------------------------------------------------

export function CreateWorkerForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const trpc = useTRPC();

  const createMutation = useMutation(
    trpc.projects.createWorker.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("fullName") ?? "").trim();
    if (!fullName) return;

    await createMutation.mutateAsync({
      projectId,
      fullName,
      role: String(fd.get("role") ?? "").trim() || null,
      payBasis:
        (String(fd.get("payBasis") ?? "") as
          | "daily"
          | "weekly"
          | "monthly"
          | "fixed_contract"
          | "milestone_based") || "daily",
      payRateMinor: Math.round(Number(fd.get("payRate") ?? 0) * 100),
    });

    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="workerName">Full Name *</FieldLabel>
          <Input
            id="workerName"
            name="fullName"
            required
            placeholder="Worker name"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="workerRole">Role</FieldLabel>
          <Input
            id="workerRole"
            name="role"
            placeholder="e.g. Mason, Electrician"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="workerPayBasis">Pay Basis</FieldLabel>
          <NativeSelect id="workerPayBasis" name="payBasis">
            {Object.entries(payBasisLabels).map(([value, label]) => (
              <NativeSelectOption key={value} value={value}>
                {label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor="workerPayRate">Pay Rate</FieldLabel>
          <Input
            id="workerPayRate"
            name="payRate"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </Field>
      </FieldGroup>
      <div>
        <Button disabled={createMutation.isPending} type="submit">
          {createMutation.isPending ? "Adding…" : "Add Worker"}
        </Button>
      </div>
    </form>
  );
}
