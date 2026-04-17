import { createPrismaClient } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader } from "@plotkeys/ui/card";
import { WORK_ROLE_LABELS } from "@plotkeys/utils";
import { Users } from "lucide-react";
import Link from "next/link";
import { DashboardEmptyState } from "../../../components/dashboard/dashboard-empty-state";
import {
  DashboardPage,
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardPageToolbar,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
  DashboardToolbarGroup,
} from "../../../components/dashboard/dashboard-page";
import { requireOnboardedSession } from "../../../lib/session";
import {
  reactivateMemberAction,
  removeMemberAction,
  revokeInviteAction,
  suspendMemberAction,
  updateMemberRoleAction,
} from "../../actions";
import { InviteMemberDialog } from "./invite-dialog";

type TeamPageProps = {
  searchParams?: Promise<{ error?: string; invited?: string }>;
};

const roleLabels: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  agent: "Agent",
  staff: "Staff",
};

const roleVariant: Record<string, "default" | "secondary" | "outline"> = {
  owner: "default",
  admin: "secondary",
  agent: "outline",
  staff: "outline",
};

const statusVariant: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  active: "default",
  invited: "secondary",
  suspended: "destructive",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

const planMemberCap: Record<string, number | null> = {
  starter: 1,
  plus: 10,
  pro: null,
};

export default async function TeamPage({ searchParams }: TeamPageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};

  const prisma = createPrismaClient().db;
  const companyId = session.activeMembership.companyId;
  const currentUserId = session.user.id;
  const currentUserRole = session.activeMembership.role;

  const [members, invites, company] = await Promise.all([
    prisma
      ? prisma.membership.findMany({
          where: { companyId, deletedAt: null },
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
          orderBy: [{ role: "asc" }, { createdAt: "asc" }],
        })
      : [],
    prisma
      ? prisma.teamInvite.findMany({
          where: {
            companyId,
            acceptedAt: null,
            revokedAt: null,
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: "desc" },
        })
      : [],
    prisma ? prisma.company.findUnique({ where: { id: companyId } }) : null,
  ]);

  const planTier = (company?.planTier ??
    "starter") as keyof typeof planMemberCap;
  const cap = planMemberCap[planTier] ?? null;
  const canInvite =
    currentUserRole === "owner" ||
    currentUserRole === "admin" ||
    currentUserRole === "platform_admin";
  const atCap =
    cap !== null &&
    members.filter((m) => m.status !== "suspended").length >= cap;

  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3901";

  return (
    <DashboardPage>
      {params.error ? (
        <Alert variant="destructive">
          <AlertDescription>{params.error}</AlertDescription>
        </Alert>
      ) : null}

      {params.invited ? (
        <Alert>
          <AlertDescription>
            Invite sent! The recipient will receive a link to join.
          </AlertDescription>
        </Alert>
      ) : null}

      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Collaboration workspace</DashboardPageEyebrow>
            <DashboardPageTitle>Team</DashboardPageTitle>
            <DashboardPageDescription>
              Manage member access, invitations, and role assignments with the
              same calm operational pattern used across the dashboard.
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            {canInvite && !atCap ? <InviteMemberDialog /> : null}
            {canInvite && atCap ? (
              <Button asChild size="sm">
                <Link href="/billing">Upgrade to add more</Link>
              </Button>
            ) : null}
          </DashboardPageActions>
        </DashboardPageHeaderRow>

        <DashboardPageToolbar>
          <DashboardToolbarGroup className="text-sm text-muted-foreground">
            {members.length} member{members.length !== 1 ? "s" : ""}
            {cap !== null
              ? ` · ${planTier} plan allows up to ${cap}`
              : " · Unlimited"}
          </DashboardToolbarGroup>
        </DashboardPageToolbar>
      </DashboardPageHeader>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Members</DashboardSectionTitle>
            <DashboardSectionDescription>
              Adjust access, suspend accounts, and keep the active workspace
              team in good standing.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <div className="grid gap-3">
          {members.map((m) => {
            const isCurrentUser = m.userId === currentUserId;
            const isOwner = m.role === "owner";
            const canEdit = canInvite && !isOwner && !isCurrentUser;

            return (
              <Card key={m.id} className="border-border/70 bg-card/82">
                <CardHeader className="flex flex-row items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                      {(m.user.name ?? m.user.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground truncate">
                          {m.user.name ?? m.user.email}
                          {isCurrentUser ? " (you)" : ""}
                        </p>
                        <Badge variant={roleVariant[m.role] ?? "outline"}>
                          {roleLabels[m.role] ?? m.role}
                        </Badge>
                        <Badge variant="outline">
                          {WORK_ROLE_LABELS[m.workRole] ?? m.workRole}
                        </Badge>
                        {m.status !== "active" ? (
                          <Badge variant={statusVariant[m.status] ?? "outline"}>
                            {m.status}
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {m.user.email}
                      </p>
                    </div>
                  </div>

                  {canEdit ? (
                    <div className="flex shrink-0 items-center gap-2">
                      {/* Role selector */}
                      <form
                        action={updateMemberRoleAction}
                        className="flex items-center gap-2"
                      >
                        <input type="hidden" name="membershipId" value={m.id} />
                        <select
                          className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                          name="role"
                          defaultValue={m.role}
                        >
                          <option value="admin">Admin</option>
                          <option value="agent">Agent</option>
                          <option value="staff">Staff</option>
                        </select>
                        <Button size="sm" type="submit" variant="outline">
                          Save
                        </Button>
                      </form>

                      {/* Suspend / reactivate */}
                      {m.status === "active" ? (
                        <form action={suspendMemberAction}>
                          <input
                            type="hidden"
                            name="membershipId"
                            value={m.id}
                          />
                          <Button
                            size="sm"
                            type="submit"
                            variant="ghost"
                            className="text-muted-foreground"
                          >
                            Suspend
                          </Button>
                        </form>
                      ) : m.status === "suspended" ? (
                        <form action={reactivateMemberAction}>
                          <input
                            type="hidden"
                            name="membershipId"
                            value={m.id}
                          />
                          <Button size="sm" type="submit" variant="outline">
                            Reactivate
                          </Button>
                        </form>
                      ) : null}

                      {/* Remove */}
                      <form action={removeMemberAction}>
                        <input type="hidden" name="membershipId" value={m.id} />
                        <Button
                          size="sm"
                          type="submit"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      </form>
                    </div>
                  ) : null}
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </DashboardSection>

      {invites.length > 0 && canInvite ? (
        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Pending invites</DashboardSectionTitle>
              <DashboardSectionDescription>
                Review outstanding invites and revoke stale access before it is
                accepted.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>
          <div className="grid gap-3">
            {invites.map((inv) => {
              const inviteUrl = `${appBaseUrl}/join/${inv.token}`;

              return (
                <Card
                  key={inv.id}
                  className="border-border/70 bg-card/82 border-dashed"
                >
                  <CardContent className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground truncate">
                          {inv.email}
                        </p>
                        <Badge variant="outline">
                          {roleLabels[inv.role] ?? inv.role}
                        </Badge>
                        <Badge variant="outline">
                          {WORK_ROLE_LABELS[inv.workRole] ?? inv.workRole}
                        </Badge>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground break-all">
                        Invite link:{" "}
                        <a
                          className="underline underline-offset-2"
                          href={inviteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {inviteUrl}
                        </a>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expires {formatDate(inv.expiresAt)}
                      </p>
                    </div>
                    <form action={revokeInviteAction}>
                      <input type="hidden" name="inviteId" value={inv.id} />
                      <Button
                        size="sm"
                        type="submit"
                        variant="ghost"
                        className="shrink-0 text-destructive hover:text-destructive"
                      >
                        Revoke
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DashboardSection>
      ) : null}

      {members.length === 0 && invites.length === 0 ? (
        <DashboardEmptyState
          description="Invite a colleague to collaborate on this workspace."
          icon={<Users className="size-5" />}
          title="No team members yet"
        />
      ) : null}
    </DashboardPage>
  );
}
