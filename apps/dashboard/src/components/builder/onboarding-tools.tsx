"use client";

import { Button } from "@plotkeys/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";

// ---------------------------------------------------------------------------
// AI Content Bootstrap — generates hero/intro/CTA copy from onboarding data.
// ---------------------------------------------------------------------------

export function AiContentBootstrapButton({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const router = useRouter();
  const trpc = useTRPC();
  const [result, setResult] = useState<{
    fieldsUpdated: string[];
    success: boolean;
  } | null>(null);

  const mutation = useMutation(
    trpc.workspace.bootstrapAiContent.mutationOptions({
      onSuccess(data) {
        setResult(data);
        router.refresh();
      },
    }),
  );

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        disabled={disabled || mutation.isPending}
        onClick={() => mutation.mutate()}
      >
        {mutation.isPending ? "Generating…" : "✨ AI-generate hero & CTA copy"}
      </Button>

      {mutation.isError && (
        <p className="text-xs text-destructive">
          {mutation.error?.message ?? "AI generation failed."}
        </p>
      )}

      {result && (
        <p className="text-xs text-muted-foreground">
          ✅ Updated {result.fieldsUpdated.length} fields:{" "}
          {result.fieldsUpdated.join(", ")}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AI Page Content — generates all editable content for a specific page.
// ---------------------------------------------------------------------------

export function GeneratePageContentButton({
  disabled = false,
  pageKey = "home",
}: {
  disabled?: boolean;
  pageKey?: string;
}) {
  const router = useRouter();
  const trpc = useTRPC();
  const [result, setResult] = useState<{
    fieldsUpdated: string[];
    success: boolean;
  } | null>(null);

  const mutation = useMutation(
    trpc.workspace.generatePageContent.mutationOptions({
      onSuccess(data) {
        setResult(data);
        router.refresh();
      },
    }),
  );

  const pageLabel = pageKey
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        disabled={disabled || mutation.isPending}
        onClick={() => mutation.mutate({ pageKey })}
      >
        {mutation.isPending
          ? "Generating…"
          : `✨ Generate ${pageLabel} page content`}
      </Button>
      <p className="text-[11px] text-muted-foreground">
        Fills all editable fields on this page using AI (10 credits).
      </p>

      {mutation.isError && (
        <p className="text-xs text-destructive">
          {mutation.error?.message ?? "AI generation failed."}
        </p>
      )}

      {result && (
        <p className="text-xs text-muted-foreground">
          ✅ Updated {result.fieldsUpdated.length} fields
        </p>
      )}
    </div>
  );
}
