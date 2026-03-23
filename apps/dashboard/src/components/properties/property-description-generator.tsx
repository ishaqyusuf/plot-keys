"use client";

import { Button } from "@plotkeys/ui/button";
import { useMutation } from "@tanstack/react-query";
import { SparklesIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { useTRPC } from "../../trpc/client";

type PropertyDescriptionGeneratorProps = {
  propertyId: string;
};

export function PropertyDescriptionGenerator({
  propertyId,
}: PropertyDescriptionGeneratorProps) {
  const router = useRouter();
  const trpc = useTRPC();

  const mutation = useMutation(
    trpc.workspace.generatePropertyDescription.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  return (
    <div className="flex flex-col gap-1.5">
      <Button
        className="w-full sm:w-auto"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate({ propertyId })}
        size="sm"
        variant="outline"
      >
        <SparklesIcon className="mr-1.5 size-3.5" />
        {mutation.isPending ? "Generating…" : "AI-generate description"}
      </Button>

      {mutation.isError && (
        <p className="text-xs text-destructive">
          {mutation.error?.message ?? "AI generation failed."}
        </p>
      )}

      {mutation.isSuccess && (
        <p className="text-xs text-muted-foreground">
          ✓ Description updated — 5 AI credits used.
        </p>
      )}
    </div>
  );
}
