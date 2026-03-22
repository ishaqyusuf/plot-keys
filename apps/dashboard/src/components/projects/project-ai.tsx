"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { useTRPC } from "../../trpc/client";

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
      <Button
        size="sm"
        variant="outline"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate({ projectId })}
      >
        {mutation.isPending ? "Generating…" : "✨ Generate AI Summary"}
      </Button>
      {mutation.isError && (
        <p className="text-sm text-destructive">
          {mutation.error?.message ?? "Failed to generate summary."}
        </p>
      )}
      {summary && (
        <div className="rounded-md border bg-muted/30 p-4">
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
  const [flags, setFlags] = useState<
    Array<{ severity: string; title: string; detail: string }> | null
  >(null);

  const mutation = useMutation(
    trpc.projects.getRiskFlags.mutationOptions({
      onSuccess(data) {
        setFlags(data.flags);
      },
    }),
  );

  return (
    <div className="space-y-3">
      <Button
        size="sm"
        variant="outline"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate({ projectId })}
      >
        {mutation.isPending ? "Analyzing…" : "🔍 Analyze Risk Flags"}
      </Button>
      {mutation.isError && (
        <p className="text-sm text-destructive">
          {mutation.error?.message ?? "Failed to analyze risks."}
        </p>
      )}
      {flags !== null && (
        <div className="space-y-2">
          {flags.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              ✅ No risks detected.
            </p>
          ) : (
            flags.map((flag, i) => (
              <div
                key={`risk-${i}-${flag.title}`}
                className="flex items-start gap-2 rounded-md border p-3"
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
      <Button
        size="sm"
        variant="outline"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate({ projectId })}
      >
        {mutation.isPending ? "Drafting…" : "📝 Draft Customer Update"}
      </Button>
      {mutation.isError && (
        <p className="text-sm text-destructive">
          {mutation.error?.message ?? "Failed to generate draft."}
        </p>
      )}
      {draft && (
        <div className="rounded-md border bg-muted/30 p-4">
          <h4 className="mb-2 text-sm font-semibold">
            Customer Update Draft
          </h4>
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
// Combined AI Insights card
// ---------------------------------------------------------------------------

export function ProjectAiInsights({ projectId }: { projectId: string }) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
          <h4 className="mb-2 text-sm font-semibold">
            Customer Update Draft
          </h4>
          <p className="mb-2 text-xs text-muted-foreground">
            Generate a polished, customer-safe progress update from your
            internal data. (5 credits)
          </p>
          <GenerateCustomerDraftButton projectId={projectId} />
        </div>
      </CardContent>
    </Card>
  );
}
