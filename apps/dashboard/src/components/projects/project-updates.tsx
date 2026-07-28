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

import { useProjectCacheInvalidation } from "@/hooks/use-project-cache-invalidation";
import { useTRPC } from "@/trpc/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

const updateKindLabels: Record<string, string> = {
  daily: "Daily",
  general: "General",
  milestone: "Milestone",
  weekly: "Weekly",
};

type ProjectUpdateItem = {
  id: string;
  kind: string;
  summary: string;
  details: string | null;
  progressPercent: number | null;
  customerVisible: boolean;
  postedAt: Date;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

// ---------------------------------------------------------------------------
// Updates list
// ---------------------------------------------------------------------------

export function UpdatesList({
  updates,
  projectId,
}: {
  updates: ProjectUpdateItem[];
  projectId: string;
}) {
  const trpc = useTRPC();
  const invalidateProjectCache = useProjectCacheInvalidation(projectId);

  const visibilityMutation = useMutation(
    trpc.projects.toggleUpdateVisibility.mutationOptions({
      onSuccess: invalidateProjectCache,
    }),
  );
  const updatingVisibilityUpdateId = visibilityMutation.isPending
    ? visibilityMutation.variables?.updateId
    : null;

  return (
    <div className="mb-4 space-y-3">
      {updates.map((update) => (
        <div key={update.id} className="border p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {updateKindLabels[update.kind] ?? update.kind}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(update.postedAt)}
              </span>
              {update.progressPercent != null && (
                <Badge variant="secondary">{update.progressPercent}%</Badge>
              )}
              {update.customerVisible && (
                <Badge variant="secondary">Customer Visible</Badge>
              )}
            </div>
            <SubmitButton
              variant="ghost"
              size="sm"
              isSubmitting={updatingVisibilityUpdateId === update.id}
              disabled={visibilityMutation.isPending}
              onClick={() =>
                visibilityMutation.mutate({
                  projectId,
                  updateId: update.id,
                  visible: !update.customerVisible,
                })
              }
            >
              {update.customerVisible ? "Hide" : "Share"}
            </SubmitButton>
          </div>
          <p className="mt-1 text-sm font-medium">{update.summary}</p>
          {update.details && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {update.details}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Create Update form
// ---------------------------------------------------------------------------

export function CreateUpdateForm({ projectId }: { projectId: string }) {
  const trpc = useTRPC();
  const invalidateProjectCache = useProjectCacheInvalidation(projectId);

  const createMutation = useMutation(
    trpc.projects.createUpdate.mutationOptions({
      onSuccess: invalidateProjectCache,
    }),
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const summary = String(fd.get("summary") ?? "").trim();
    if (!summary) return;

    const progressRaw = String(fd.get("progressPercent") ?? "").trim();
    const progressParsed = progressRaw
      ? Number.parseInt(progressRaw, 10)
      : null;
    const progressPercent =
      progressParsed != null && !Number.isNaN(progressParsed)
        ? Math.max(0, Math.min(100, progressParsed))
        : null;

    await createMutation.mutateAsync({
      projectId,
      summary,
      kind:
        (String(fd.get("kind") ?? "").trim() as
          | "daily"
          | "weekly"
          | "milestone"
          | "general") || "general",
      details: String(fd.get("details") ?? "").trim() || null,
      progressPercent,
    });

    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <Label htmlFor="updateSummary">Summary *</Label>
        <Input
          id="updateSummary"
          name="summary"
          required
          placeholder="What happened?"
        />
      </div>
      <div>
        <Label htmlFor="updateKind">Type</Label>
        <Select defaultValue="general" name="kind">
          <SelectTrigger id="updateKind" className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="milestone">Milestone</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="updateDetails">Details</Label>
        <Input
          id="updateDetails"
          name="details"
          placeholder="Additional notes"
        />
      </div>
      <div>
        <Label htmlFor="updateProgress">Progress %</Label>
        <Input
          id="updateProgress"
          name="progressPercent"
          type="number"
          min="0"
          max="100"
          placeholder="0-100"
        />
      </div>
      <div className="sm:col-span-2">
        <SubmitButton isSubmitting={createMutation.isPending}>
          Post Update
        </SubmitButton>
      </div>
    </form>
  );
}
