"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useTRPC } from "../../trpc/client";

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const milestoneStatusConfig: Record<
  string,
  { label: string; variant: "default" | "outline" | "secondary" | "destructive" }
> = {
  completed: { label: "Completed", variant: "default" },
  in_progress: { label: "In Progress", variant: "secondary" },
  overdue: { label: "Overdue", variant: "destructive" },
  pending: { label: "Pending", variant: "outline" },
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Milestone = {
  id: string;
  name: string;
  status: string;
  dueDate: Date | null;
  customerVisible: boolean;
  phase: { id: string; name: string } | null;
};

type Phase = { id: string; name: string };

// ---------------------------------------------------------------------------
// Milestone list
// ---------------------------------------------------------------------------

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function MilestoneList({
  milestones,
  projectId,
}: {
  milestones: Milestone[];
  projectId: string;
}) {
  const router = useRouter();
  const trpc = useTRPC();

  const updateMutation = useMutation(
    trpc.projects.updateMilestone.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  const visibilityMutation = useMutation(
    trpc.projects.toggleMilestoneVisibility.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  return (
    <div className="mb-4 space-y-2">
      {milestones.map((milestone) => (
        <div
          key={milestone.id}
          className="flex items-center justify-between rounded-md border p-3"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{milestone.name}</span>
              <Badge
                variant={
                  milestoneStatusConfig[milestone.status]?.variant ?? "outline"
                }
              >
                {milestoneStatusConfig[milestone.status]?.label ??
                  milestone.status}
              </Badge>
              {milestone.phase && (
                <Badge variant="outline">{milestone.phase.name}</Badge>
              )}
              {milestone.customerVisible && (
                <Badge variant="secondary">Customer Visible</Badge>
              )}
            </div>
            {milestone.dueDate && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Due: {formatDate(milestone.dueDate)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              disabled={visibilityMutation.isPending}
              onClick={() =>
                visibilityMutation.mutate({
                  projectId,
                  milestoneId: milestone.id,
                  visible: !milestone.customerVisible,
                })
              }
            >
              {milestone.customerVisible ? "Hide" : "Share"}
            </Button>
            {milestone.status === "pending" && (
              <Button
                size="sm"
                variant="outline"
                disabled={updateMutation.isPending}
                onClick={() =>
                  updateMutation.mutate({
                    projectId,
                    milestoneId: milestone.id,
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
// Create Milestone form
// ---------------------------------------------------------------------------

export function CreateMilestoneForm({
  projectId,
  phases,
}: {
  projectId: string;
  phases: Phase[];
}) {
  const router = useRouter();
  const trpc = useTRPC();

  const createMutation = useMutation(
    trpc.projects.createMilestone.mutationOptions({
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

    await createMutation.mutateAsync({
      projectId,
      name,
      phaseId: String(fd.get("phaseId") ?? "").trim() || null,
      dueDate: String(fd.get("dueDate") ?? "").trim() || null,
    });

    e.currentTarget.reset();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-3 sm:grid-cols-3"
    >
      <div>
        <Label htmlFor="milestoneName">Add Milestone</Label>
        <Input
          id="milestoneName"
          name="name"
          required
          placeholder="e.g. Foundation complete"
        />
      </div>
      <div>
        <Label htmlFor="milestoneDueDate">Due Date</Label>
        <Input id="milestoneDueDate" name="dueDate" type="date" />
      </div>
      <div>
        <Label htmlFor="milestonePhase">Phase</Label>
        <select
          id="milestonePhase"
          name="phaseId"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
        >
          <option value="">No phase</option>
          {phases.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-3">
        <Button disabled={createMutation.isPending} type="submit">
          {createMutation.isPending ? "Adding…" : "Add Milestone"}
        </Button>
      </div>
    </form>
  );
}
