"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useTRPC } from "../../trpc/client";

// ---------------------------------------------------------------------------
// Phase status config
// ---------------------------------------------------------------------------

const phaseStatusConfig: Record<
  string,
  { label: string; variant: "default" | "outline" | "secondary" | "destructive" }
> = {
  completed: { label: "Completed", variant: "default" },
  in_progress: { label: "In Progress", variant: "secondary" },
  not_started: { label: "Not Started", variant: "outline" },
  on_hold: { label: "On Hold", variant: "destructive" },
};

// ---------------------------------------------------------------------------
// Phase list + inline status buttons
// ---------------------------------------------------------------------------

type Phase = {
  id: string;
  name: string;
  status: string;
  order: number;
};

export function PhaseList({
  phases,
  projectId,
}: {
  phases: Phase[];
  projectId: string;
}) {
  const router = useRouter();
  const trpc = useTRPC();

  const updateMutation = useMutation(
    trpc.projects.updatePhase.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  return (
    <div className="mb-4 space-y-2">
      {phases.map((phase) => (
        <div
          key={phase.id}
          className="flex items-center justify-between rounded-md border p-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{phase.name}</span>
            <Badge variant={phaseStatusConfig[phase.status]?.variant ?? "outline"}>
              {phaseStatusConfig[phase.status]?.label ?? phase.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {phase.status === "not_started" && (
              <Button
                size="sm"
                variant="outline"
                disabled={updateMutation.isPending}
                onClick={() =>
                  updateMutation.mutate({
                    projectId,
                    phaseId: phase.id,
                    status: "in_progress",
                  })
                }
              >
                Start
              </Button>
            )}
            {phase.status === "in_progress" && (
              <Button
                size="sm"
                variant="outline"
                disabled={updateMutation.isPending}
                onClick={() =>
                  updateMutation.mutate({
                    projectId,
                    phaseId: phase.id,
                    status: "completed",
                  })
                }
              >
                Complete
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Create Phase form
// ---------------------------------------------------------------------------

export function CreatePhaseForm({
  projectId,
  nextOrder,
}: {
  projectId: string;
  nextOrder: number;
}) {
  const router = useRouter();
  const trpc = useTRPC();

  const createMutation = useMutation(
    trpc.projects.createPhase.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    if (!name) return;

    const orderRaw = String(fd.get("order") ?? "").trim();
    const order = orderRaw ? Number.parseInt(orderRaw, 10) : nextOrder;

    await createMutation.mutateAsync({
      projectId,
      name,
      order: Number.isNaN(order) ? nextOrder : order,
    });

    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-2">
      <div className="flex-1">
        <Label htmlFor="phaseName">Add Phase</Label>
        <Input id="phaseName" name="name" required placeholder="e.g. Foundation" />
      </div>
      <div className="w-20">
        <Label htmlFor="phaseOrder">Order</Label>
        <Input
          id="phaseOrder"
          name="order"
          type="number"
          defaultValue={nextOrder}
        />
      </div>
      <Button disabled={createMutation.isPending} type="submit">
        {createMutation.isPending ? "…" : "Add"}
      </Button>
    </form>
  );
}
