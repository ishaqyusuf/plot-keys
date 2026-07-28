"use client";

import { Badge } from "@plotkeys/ui/badge";
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

const emptyMembershipValue = "none";

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

export function TeamList({ assignments }: { assignments: Assignment[] }) {
  return (
    <div className="mb-4 space-y-2">
      {assignments.map((assignment) => (
        <div
          key={assignment.id}
          className="flex items-center justify-between border p-3"
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
  const trpc = useTRPC();
  const invalidateProjectCache = useProjectCacheInvalidation(projectId);

  const assignMutation = useMutation(
    trpc.projects.assignMember.mutationOptions({
      onSuccess: invalidateProjectCache,
    }),
  );
  const [membershipId, setMembershipId] = useState(emptyMembershipValue);

  const available = teamMembers.filter((m) => !assignedMemberIds.has(m.id));
  if (available.length === 0) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const selectedMembershipId =
      membershipId === emptyMembershipValue ? "" : membershipId;
    if (!selectedMembershipId) return;

    await assignMutation.mutateAsync({
      projectId,
      membershipId: selectedMembershipId,
      projectRole:
        (String(fd.get("projectRole") ?? "").trim() as
          | "project_owner"
          | "project_manager"
          | "qs_manager"
          | "finance_reviewer"
          | "site_supervisor"
          | "viewer") || "viewer",
    });
    setMembershipId(emptyMembershipValue);
  }

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-2">
      <div className="flex-1">
        <Label htmlFor="membershipId">Assign Member</Label>
        <Select
          name="membershipId"
          onValueChange={setMembershipId}
          value={membershipId}
        >
          <SelectTrigger id="membershipId" className="w-full">
            <SelectValue placeholder="Select member" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={emptyMembershipValue}>Select member</SelectItem>
            {available.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.user.name ?? m.user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-48">
        <Label htmlFor="projectRole">Role</Label>
        <Select defaultValue="viewer" name="projectRole">
          <SelectTrigger id="projectRole" className="w-full">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="viewer">Viewer</SelectItem>
            <SelectItem value="site_supervisor">Site Supervisor</SelectItem>
            <SelectItem value="project_manager">Project Manager</SelectItem>
            <SelectItem value="project_owner">Project Owner</SelectItem>
            <SelectItem value="qs_manager">QS Manager</SelectItem>
            <SelectItem value="finance_reviewer">Finance Reviewer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <SubmitButton
        isSubmitting={assignMutation.isPending}
        disabled={membershipId === emptyMembershipValue}
      >
        Assign
      </SubmitButton>
    </form>
  );
}
