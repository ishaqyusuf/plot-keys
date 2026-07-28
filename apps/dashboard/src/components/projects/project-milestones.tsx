"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@plotkeys/ui/select";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { useProjectCacheInvalidation } from "@/hooks/use-project-cache-invalidation";
import { useTRPC } from "@/trpc/client";

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const milestoneStatusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  }
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

const noPhaseValue = "no-phase";

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
  const trpc = useTRPC();
  const invalidateProjectCache = useProjectCacheInvalidation(projectId);

  const updateMutation = useMutation(
    trpc.projects.updateMilestone.mutationOptions({
      onSuccess: invalidateProjectCache,
    }),
  );

  const visibilityMutation = useMutation(
    trpc.projects.toggleMilestoneVisibility.mutationOptions({
      onSuccess: invalidateProjectCache,
    }),
  );
  const updatingMilestoneId = updateMutation.isPending
    ? updateMutation.variables?.milestoneId
    : null;
  const updatingVisibilityMilestoneId = visibilityMutation.isPending
    ? visibilityMutation.variables?.milestoneId
    : null;

  return (
    <div className="mb-4 space-y-2">
      {milestones.map((milestone) => (
        <div
          key={milestone.id}
          className="flex items-center justify-between border p-3"
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
            <SubmitButton
              variant="ghost"
              size="sm"
              isSubmitting={updatingVisibilityMilestoneId === milestone.id}
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
            </SubmitButton>
            {milestone.status === "pending" && (
              <SubmitButton
                variant="outline"
                size="sm"
                isSubmitting={updatingMilestoneId === milestone.id}
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
              </SubmitButton>
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
  const trpc = useTRPC();
  const invalidateProjectCache = useProjectCacheInvalidation(projectId);
  const [phaseId, setPhaseId] = useState(noPhaseValue);

  const createMutation = useMutation(
    trpc.projects.createMilestone.mutationOptions({
      onSuccess: invalidateProjectCache,
    }),
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const selectedPhaseId = String(fd.get("phaseId") ?? "").trim();
    if (!name) return;

    await createMutation.mutateAsync({
      projectId,
      name,
      phaseId:
        selectedPhaseId === noPhaseValue ? null : selectedPhaseId || null,
      dueDate: String(fd.get("dueDate") ?? "").trim() || null,
    });

    e.currentTarget.reset();
    setPhaseId(noPhaseValue);
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
        <Select name="phaseId" onValueChange={setPhaseId} value={phaseId}>
          <SelectTrigger id="milestonePhase" className="w-full">
            <SelectValue placeholder="No phase" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={noPhaseValue}>No phase</SelectItem>
            {phases.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="sm:col-span-3">
        <SubmitButton isSubmitting={createMutation.isPending}>
          Add Milestone
        </SubmitButton>
      </div>
    </form>
  );
}
