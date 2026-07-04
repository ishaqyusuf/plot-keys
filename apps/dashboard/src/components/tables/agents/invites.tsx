"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { revokeInviteAction } from "@/app/actions";
import {
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
} from "@/components/dashboard/dashboard-page";
import { useTRPC } from "@/trpc/client";

type AgentInvitesProps = {
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

export function AgentInvites({ appBaseUrl, isDevMode }: AgentInvitesProps) {
  const trpc = useTRPC();
  const { data: invites } = useSuspenseQuery(
    trpc.team.listInvites.queryOptions(),
  );
  const agentInvites = invites.filter((invite) => invite.role === "agent");

  if (!agentInvites.length) {
    return null;
  }

  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Pending invites</DashboardSectionTitle>
          <DashboardSectionDescription>
            Review outstanding invitations before they expire.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <div className="divide-y divide-border/70 rounded-[1.25rem] border border-dashed border-border/70 bg-card/76 shadow-[var(--shadow-soft)]">
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
              <form action={revokeInviteAction}>
                <input name="inviteId" type="hidden" value={invite.id} />
                <Button size="sm" type="submit" variant="ghost">
                  Revoke
                </Button>
              </form>
            </div>
          );
        })}
      </div>
    </DashboardSection>
  );
}
