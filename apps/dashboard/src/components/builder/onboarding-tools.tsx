"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BuilderAiToolControl } from "@/components/builder/builder-ai-tool-control";
import { useTRPC } from "@/trpc/client";

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
    trpc.website.bootstrapAiContent.mutationOptions({
      onSuccess(data) {
        setResult(data);
        router.refresh();
      },
    }),
  );

  const resultMessage = result
    ? `Updated ${result.fieldsUpdated.length} fields: ${result.fieldsUpdated.join(", ")}`
    : undefined;

  return (
    <BuilderAiToolControl
      disabled={disabled}
      errorMessage={mutation.error?.message}
      idleLabel="Generate hero and CTA copy"
      isError={mutation.isError}
      isPending={mutation.isPending}
      onRun={() => mutation.mutate()}
      resultMessage={resultMessage}
    />
  );
}

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
    trpc.website.generatePageContent.mutationOptions({
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

  const resultMessage = result
    ? `Updated ${result.fieldsUpdated.length} fields`
    : undefined;

  return (
    <BuilderAiToolControl
      description="Fills all editable fields on this page using AI (10 credits)."
      disabled={disabled}
      errorMessage={mutation.error?.message}
      idleLabel={`Generate ${pageLabel} page content`}
      isError={mutation.isError}
      isPending={mutation.isPending}
      onRun={() => mutation.mutate({ pageKey })}
      resultMessage={resultMessage}
    />
  );
}
