"use client";

import { Button } from "@plotkeys/ui/button";
import { useMutation } from "@tanstack/react-query";

import { useProjectCacheInvalidation } from "@/hooks/use-project-cache-invalidation";
import { useTRPC } from "../../trpc/client";

export function UpdateProjectStatusButton({
  projectId,
  status,
  label,
  variant = "default",
}: {
  projectId: string;
  status: "draft" | "active" | "paused" | "delayed" | "completed" | "archived";
  label: string;
  variant?: "default" | "outline" | "secondary" | "destructive";
}) {
  const trpc = useTRPC();
  const invalidateProjectCache = useProjectCacheInvalidation(projectId);

  const mutation = useMutation(
    trpc.projects.update.mutationOptions({
      onSuccess: invalidateProjectCache,
    }),
  );

  return (
    <Button
      size="sm"
      variant={variant}
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ projectId, status })}
    >
      {mutation.isPending ? "…" : label}
    </Button>
  );
}

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const trpc = useTRPC();
  const invalidateProjectCache = useProjectCacheInvalidation(projectId);

  const mutation = useMutation(
    trpc.projects.delete.mutationOptions({
      onSuccess: invalidateProjectCache,
    }),
  );

  return (
    <Button
      size="sm"
      variant="destructive"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ projectId })}
    >
      {mutation.isPending ? "…" : "Delete"}
    </Button>
  );
}
