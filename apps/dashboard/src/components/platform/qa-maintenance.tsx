"use client";

import { Checkbox } from "@plotkeys/ui/checkbox";
import { Input } from "@plotkeys/ui/input";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";

export function QaMaintenance() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [confirmation, setConfirmation] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const { data: candidates } = useSuspenseQuery(
    trpc.qaMaintenance.candidates.queryOptions(),
  );
  const { data: preview } = useSuspenseQuery(
    trpc.qaMaintenance.preview.queryOptions(),
  );
  const adopt = useMutation(
    trpc.qaMaintenance.adopt.mutationOptions({
      onSuccess: async () => {
        setSelected([]);
        await Promise.all([
          queryClient.invalidateQueries(
            trpc.qaMaintenance.candidates.queryFilter(),
          ),
          queryClient.invalidateQueries(
            trpc.qaMaintenance.preview.queryFilter(),
          ),
        ]);
      },
    }),
  );
  const purge = useMutation(trpc.qaMaintenance.start.mutationOptions());

  return (
    <div className="grid gap-6">
      <section className="border border-border bg-card p-5">
        <h2 className="font-medium">Candidate QA companies</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select candidates to explicitly mark as QA. Email matching alone never
          makes a company purgeable.
        </p>
        <div className="mt-4 grid gap-3">
          {candidates.map((candidate) => (
            <label
              className="flex items-center gap-3 text-sm"
              htmlFor={`qa-company-${candidate.id}`}
              key={candidate.id}
            >
              <Checkbox
                checked={selected.includes(candidate.id)}
                id={`qa-company-${candidate.id}`}
                onCheckedChange={(checked) =>
                  setSelected((current) =>
                    checked
                      ? [...current, candidate.id]
                      : current.filter((id) => id !== candidate.id),
                  )
                }
              />
              {candidate.name}
            </label>
          ))}
          {!candidates.length && (
            <p className="text-sm text-muted-foreground">
              No candidates found.
            </p>
          )}
        </div>
        <SubmitButton
          className="mt-4"
          disabled={!selected.length}
          isSubmitting={adopt.isPending}
          onClick={() => adopt.mutate({ companyIds: selected })}
          variant="outline"
        >
          Adopt selected as QA
        </SubmitButton>
      </section>

      <section className="border border-border bg-card p-5">
        <h2 className="font-medium">Purge preview</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(preview.counts).map(([label, value]) => (
            <div className="border p-3" key={label}>
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="mt-1 text-lg font-medium">{String(value)}</div>
            </div>
          ))}
        </div>
        {!!preview.blockers.length && (
          <p className="mt-4 border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            Resolve {preview.blockers.length} live-resource or credential
            blocker(s) before deletion.
          </p>
        )}
        <label className="mt-5 grid gap-2 text-sm" htmlFor="qa-confirmation">
          Type <strong>PURGE ALL QA DATA</strong> to continue.
          <Input
            id="qa-confirmation"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
          />
        </label>
        <SubmitButton
          className="mt-3"
          disabled={
            confirmation !== "PURGE ALL QA DATA" ||
            !preview.previewToken ||
            !!preview.blockers.length
          }
          isSubmitting={purge.isPending}
          onClick={() =>
            preview.previewToken &&
            purge.mutate({
              confirmation: "PURGE ALL QA DATA",
              previewToken: preview.previewToken,
            })
          }
          variant="destructive"
        >
          Permanently purge all QA data
        </SubmitButton>
      </section>
    </div>
  );
}
