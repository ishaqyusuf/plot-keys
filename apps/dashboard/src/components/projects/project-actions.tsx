"use client";

import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation } from "@tanstack/react-query";

import { useProjectCacheInvalidation } from "@/hooks/use-project-cache-invalidation";
import { useTRPC } from "@/trpc/client";

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
    <SubmitButton
      variant={variant}
      size="sm"
      isSubmitting={mutation.isPending}
      onClick={() => mutation.mutate({ projectId, status })}
      type="button"
    >
      {label}
    </SubmitButton>
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
    <SubmitButton
      variant="destructive"
      size="sm"
      isSubmitting={mutation.isPending}
      onClick={() => mutation.mutate({ projectId })}
      type="button"
    >
      Delete
    </SubmitButton>
  );
}
