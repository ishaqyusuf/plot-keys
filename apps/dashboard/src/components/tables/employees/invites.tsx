"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { WORK_ROLE_LABELS } from "@plotkeys/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { revokeInviteAction } from "@/app/actions";
import {
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
} from "@/components/dashboard/dashboard-page";
import { useTRPC } from "@/trpc/client";

type EmployeeInvitesProps = {
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

export function EmployeeInvites({
  appBaseUrl,
  isDevMode,
}: EmployeeInvitesProps) {
  const trpc = useTRPC();
  const { data: invites } = useSuspenseQuery(
    trpc.team.listInvites.queryOptions(),
  );
  const employeeInvites = invites.filter((invite) => invite.role === "staff");

  if (!employeeInvites.length) {
    return null;
  }

  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Pending invites</DashboardSectionTitle>
          <DashboardSectionDescription>
            Review staff invitations that still need attention.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <div className="divide-y divide-border/70 rounded-[1.25rem] border border-dashed border-border/70 bg-card/76 shadow-[var(--shadow-soft)]">
        {employeeInvites.map((invite) => {
          const inviteUrl = `${appBaseUrl}/join/${invite.token}`;
          const workRole = invite.workRole
            ? (WORK_ROLE_LABELS[invite.workRole] ?? invite.workRole)
            : "Unassigned";

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
                  <Badge variant="outline">{workRole}</Badge>
                  <Badge variant="secondary">Pending employee setup</Badge>
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
                <Button
                  className="shrink-0 text-destructive hover:text-destructive"
                  size="sm"
                  type="submit"
                  variant="ghost"
                >
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
