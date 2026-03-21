"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Label } from "@plotkeys/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useTRPC } from "../../trpc/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

const roleLabels: Record<string, string> = {
  finance_reviewer: "Finance Reviewer",
  project_manager: "Project Manager",
  project_owner: "Project Owner",
  qs_manager: "QS Manager",
  site_supervisor: "Site Supervisor",
  viewer: "Viewer",
};

type Assignment = {
  id: string;
  membershipId: string;
  projectRole: string;
  membership: {
    user: { id: string; name: string | null; email: string };
  };
};

type TeamMember = {
  id: string;
  user: { id: string; name: string | null; email: string };
};

// ---------------------------------------------------------------------------
// Team list
// ---------------------------------------------------------------------------

export function TeamList({
  assignments,
}: {
  assignments: Assignment[];
}) {
  return (
    <div className="mb-4 space-y-2">
      {assignments.map((assignment) => (
        <div
          key={assignment.id}
          className="flex items-center justify-between rounded-md border p-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {assignment.membership.user.name ??
                assignment.membership.user.email}
            </span>
            <Badge variant="outline">
              {roleLabels[assignment.projectRole] ?? assignment.projectRole}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Assign member form
// ---------------------------------------------------------------------------

export function AssignMemberForm({
  projectId,
  teamMembers,
  assignedMemberIds,
}: {
  projectId: string;
  teamMembers: TeamMember[];
  assignedMemberIds: Set<string>;
}) {
  const router = useRouter();
  const trpc = useTRPC();

  const assignMutation = useMutation(
    trpc.projects.assignMember.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  const available = teamMembers.filter((m) => !assignedMemberIds.has(m.id));
  if (available.length === 0) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const membershipId = String(fd.get("membershipId") ?? "").trim();
    if (!membershipId) return;

    await assignMutation.mutateAsync({
      projectId,
      membershipId,
      projectRole:
        (String(fd.get("projectRole") ?? "").trim() as
          | "project_owner"
          | "project_manager"
          | "qs_manager"
          | "finance_reviewer"
          | "site_supervisor"
          | "viewer") || "viewer",
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-2">
      <div className="flex-1">
        <Label htmlFor="membershipId">Assign Member</Label>
        <select
          id="membershipId"
          name="membershipId"
          required
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
        >
          <option value="">Select member</option>
          {available.map((m) => (
            <option key={m.id} value={m.id}>
              {m.user.name ?? m.user.email}
            </option>
          ))}
        </select>
      </div>
      <div className="w-48">
        <Label htmlFor="projectRole">Role</Label>
        <select
          id="projectRole"
          name="projectRole"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
        >
          <option value="viewer">Viewer</option>
          <option value="site_supervisor">Site Supervisor</option>
          <option value="project_manager">Project Manager</option>
          <option value="project_owner">Project Owner</option>
          <option value="qs_manager">QS Manager</option>
          <option value="finance_reviewer">Finance Reviewer</option>
        </select>
      </div>
      <Button disabled={assignMutation.isPending} type="submit">
        {assignMutation.isPending ? "…" : "Assign"}
      </Button>
    </form>
  );
}
