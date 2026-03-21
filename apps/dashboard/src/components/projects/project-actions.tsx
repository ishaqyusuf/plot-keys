"use client";

import { Button } from "@plotkeys/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const trpc = useTRPC();

  const mutation = useMutation(
    trpc.projects.update.mutationOptions({
      onSuccess() {
        router.refresh();
      },
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
  const router = useRouter();
  const trpc = useTRPC();

  const mutation = useMutation(
    trpc.projects.delete.mutationOptions({
      onSuccess() {
        router.refresh();
      },
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
