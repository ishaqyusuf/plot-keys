"use client";

import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Icon } from "@plotkeys/ui/icons";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { useTRPC } from "@/trpc/client";

// ---------------------------------------------------------------------------
// Generate Summary
// ---------------------------------------------------------------------------

export function GenerateSummaryButton({ projectId }: { projectId: string }) {
  const trpc = useTRPC();
  const [summary, setSummary] = useState<string | null>(null);

  const mutation = useMutation(
    trpc.projects.generateSummary.mutationOptions({
      onSuccess(data) {
        setSummary(data.summary);
      },
    }),
  );

  return (
    <div className="space-y-3">
      <SubmitButton
        variant="outline"
        size="sm"
        isSubmitting={mutation.isPending}
        onClick={() => mutation.mutate({ projectId })}
        type="button"
      >
        <Icon.Sparkles className="mr-2 size-4" />
        Generate AI Summary
      </SubmitButton>
      {mutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {mutation.error?.message ?? "Failed to generate summary."}
          </AlertDescription>
        </Alert>
      )}
      {summary && (
        <div className="border bg-background p-4">
          <h4 className="mb-2 text-sm font-semibold">AI Project Summary</h4>
          <div className="whitespace-pre-wrap text-sm text-muted-foreground">
            {summary}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Risk Flags
// ---------------------------------------------------------------------------

const severityVariant: Record<
  string,
  "default" | "outline" | "secondary" | "destructive"
> = {
  critical: "destructive",
  high: "destructive",
  low: "outline",
  medium: "secondary",
};

export function RiskFlagsButton({ projectId }: { projectId: string }) {
  const trpc = useTRPC();
  const [flags, setFlags] = useState<Array<{
    severity: string;
    title: string;
    detail: string;
  }> | null>(null);

  const mutation = useMutation(
    trpc.projects.getRiskFlags.mutationOptions({
      onSuccess(data) {
        setFlags(data.flags);
      },
    }),
  );

  return (
    <div className="space-y-3">
      <SubmitButton
        variant="outline"
        size="sm"
        isSubmitting={mutation.isPending}
        onClick={() => mutation.mutate({ projectId })}
        type="button"
      >
        <Icon.Search className="mr-2 size-4" />
        Analyze Risk Flags
      </SubmitButton>
      {mutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {mutation.error?.message ?? "Failed to analyze risks."}
          </AlertDescription>
        </Alert>
      )}
      {flags !== null && (
        <div className="space-y-2">
          {flags.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon.CheckCircle className="size-4" />
              No risks detected.
            </p>
          ) : (
            flags.map((flag) => (
              <div
                key={`${flag.severity}-${flag.title}-${flag.detail}`}
                className="flex items-start gap-2 border p-3"
              >
                <Badge variant={severityVariant[flag.severity] ?? "outline"}>
                  {flag.severity}
                </Badge>
                <div>
                  <p className="text-sm font-medium">{flag.title}</p>
                  <p className="text-xs text-muted-foreground">{flag.detail}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Customer Update Draft
// ---------------------------------------------------------------------------

export function GenerateCustomerDraftButton({
  projectId,
}: {
  projectId: string;
}) {
  const trpc = useTRPC();
  const [draft, setDraft] = useState<string | null>(null);

  const mutation = useMutation(
    trpc.projects.generateCustomerDraft.mutationOptions({
      onSuccess(data) {
        setDraft(data.draft);
      },
    }),
  );

  return (
    <div className="space-y-3">
      <SubmitButton
        variant="outline"
        size="sm"
        isSubmitting={mutation.isPending}
        onClick={() => mutation.mutate({ projectId })}
        type="button"
      >
        <Icon.MessageCircle className="mr-2 size-4" />
        Draft Customer Update
      </SubmitButton>
      {mutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {mutation.error?.message ?? "Failed to generate draft."}
          </AlertDescription>
        </Alert>
      )}
      {draft && (
        <div className="border bg-background p-4">
          <h4 className="mb-2 text-sm font-semibold">Customer Update Draft</h4>
          <div className="whitespace-pre-wrap text-sm text-muted-foreground">
            {draft}
          </div>
          <p className="mt-2 text-xs text-muted-foreground italic">
            Review and edit before sharing with customers.
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Combined AI actions
// ---------------------------------------------------------------------------

export function ProjectAiInsights({ projectId }: { projectId: string }) {
  return (
    <div className="border bg-background p-5">
      <div className="space-y-6">
        <div>
          <h4 className="mb-2 text-sm font-semibold">Executive Summary</h4>
          <p className="mb-2 text-xs text-muted-foreground">
            Generate an AI-powered summary of this project's status, progress,
            and key issues. (10 credits)
          </p>
          <GenerateSummaryButton projectId={projectId} />
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">Risk Analysis</h4>
          <p className="mb-2 text-xs text-muted-foreground">
            Detect overdue milestones, budget overruns, and other project risks.
            (5 credits)
          </p>
          <RiskFlagsButton projectId={projectId} />
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">Customer Update Draft</h4>
          <p className="mb-2 text-xs text-muted-foreground">
            Generate a polished, customer-safe progress update from your
            internal data. (5 credits)
          </p>
          <GenerateCustomerDraftButton projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
