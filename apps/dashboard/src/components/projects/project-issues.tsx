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

const issueStatusConfig: Record<
  string,
  { label: string; variant: "default" | "outline" | "secondary" | "destructive" }
> = {
  closed: { label: "Closed", variant: "outline" },
  in_progress: { label: "In Progress", variant: "secondary" },
  open: { label: "Open", variant: "destructive" },
  resolved: { label: "Resolved", variant: "default" },
};

const severityConfig: Record<
  string,
  { label: string; variant: "default" | "outline" | "secondary" | "destructive" }
> = {
  critical: { label: "Critical", variant: "destructive" },
  high: { label: "High", variant: "destructive" },
  low: { label: "Low", variant: "outline" },
  medium: { label: "Medium", variant: "secondary" },
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Issue = {
  id: string;
  title: string;
  description: string | null;
  severity: string;
  status: string;
};

// ---------------------------------------------------------------------------
// Issue list
// ---------------------------------------------------------------------------

export function IssueList({
  issues,
  projectId,
}: {
  issues: Issue[];
  projectId: string;
}) {
  const router = useRouter();
  const trpc = useTRPC();

  const updateMutation = useMutation(
    trpc.projects.updateIssue.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  return (
    <div className="mb-4 space-y-2">
      {issues.map((issue) => (
        <div
          key={issue.id}
          className="flex items-center justify-between rounded-md border p-3"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{issue.title}</span>
              <Badge
                variant={issueStatusConfig[issue.status]?.variant ?? "outline"}
              >
                {issueStatusConfig[issue.status]?.label ?? issue.status}
              </Badge>
              <Badge
                variant={severityConfig[issue.severity]?.variant ?? "outline"}
              >
                {severityConfig[issue.severity]?.label ?? issue.severity}
              </Badge>
            </div>
            {issue.description && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {issue.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {issue.status === "open" && (
              <Button
                size="sm"
                variant="outline"
                disabled={updateMutation.isPending}
                onClick={() =>
                  updateMutation.mutate({
                    projectId,
                    issueId: issue.id,
                    status: "resolved",
                  })
                }
              >
                Resolve
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Create Issue form
// ---------------------------------------------------------------------------

export function CreateIssueForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const trpc = useTRPC();

  const createMutation = useMutation(
    trpc.projects.createIssue.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") ?? "").trim();
    if (!title) return;

    await createMutation.mutateAsync({
      projectId,
      title,
      description: String(fd.get("description") ?? "").trim() || null,
      severity:
        (String(fd.get("severity") ?? "").trim() as
          | "low"
          | "medium"
          | "high"
          | "critical") || "medium",
    });

    e.currentTarget.reset();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      <div>
        <Label htmlFor="issueTitle">Title *</Label>
        <Input
          id="issueTitle"
          name="title"
          required
          placeholder="Issue title"
        />
      </div>
      <div>
        <Label htmlFor="issueSeverity">Severity</Label>
        <select
          id="issueSeverity"
          name="severity"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="issueDesc">Description</Label>
        <Input
          id="issueDesc"
          name="description"
          placeholder="Details about the issue"
        />
      </div>
      <div className="sm:col-span-2">
        <Button disabled={createMutation.isPending} type="submit">
          {createMutation.isPending ? "Reporting…" : "Report Issue"}
        </Button>
      </div>
    </form>
  );
}
