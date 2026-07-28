"use client";

import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";

type Props = {
  appBaseUrl: string;
  isDevMode: boolean;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function AgentInvites({ appBaseUrl, isDevMode }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [revokeError, setRevokeError] = useState<string | null>(null);
  const { data: invites } = useSuspenseQuery(
    trpc.team.listInvites.queryOptions(),
  );
  const revokeInviteMutation = useMutation(
    trpc.team.revokeInvite.mutationOptions({
      onError: (error) => {
        setRevokeError(error.message || "Failed to revoke invite.");
      },
      onMutate: () => {
        setRevokeError(null);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.team.listInvites.queryKey(),
        });
      },
    }),
  );
  const agentInvites = invites.filter((invite) => invite.role === "agent");
  const pendingInviteId = revokeInviteMutation.isPending
    ? revokeInviteMutation.variables?.inviteId
    : null;

  if (!agentInvites.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium">Pending invites</h2>
          <p className="text-sm text-muted-foreground">
            Review outstanding invitations before they expire.
          </p>
          {revokeError ? (
            <Alert variant="destructive" className="mt-3">
              <AlertDescription>{revokeError}</AlertDescription>
            </Alert>
          ) : null}
        </div>
      </div>

      <div className="divide-y divide-border border-x border-b border-border">
        {agentInvites.map((invite) => {
          const inviteUrl = `${appBaseUrl}/join/${invite.token}`;

          return (
            <div
              className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between"
              key={invite.id}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium text-foreground">
                    {invite.email}
                  </p>
                  <Badge variant="secondary">Pending agent setup</Badge>
                </div>
                {isDevMode ? (
                  <p className="mt-1 break-all text-xs text-muted-foreground">
                    Dev invite link:{" "}
                    <a
                      className="underline underline-offset-2"
                      href={inviteUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {inviteUrl}
                    </a>
                  </p>
                ) : null}
                <p className="text-xs text-muted-foreground">
                  Expires {formatDate(invite.expiresAt)}
                </p>
              </div>
              <SubmitButton
                className="shrink-0 text-destructive hover:text-destructive"
                isSubmitting={pendingInviteId === invite.id}
                onClick={() =>
                  revokeInviteMutation.mutate({ inviteId: invite.id })
                }
                variant="ghost"
                size="sm"
              >
                Revoke
              </SubmitButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
