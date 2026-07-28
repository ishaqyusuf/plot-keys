import "server-only";

import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { WORK_ROLE_LABELS } from "@plotkeys/utils";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs";

import { requireAuthenticatedSession } from "@/lib/session";
import { getQueryClient, trpc } from "@/trpc/server";

import { InviteProfileCompletionForm } from "./invite-profile-completion-form";

export const metadata: Metadata = {
  title: "Complete Invite Profile | Plot Keys",
};

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<SearchParams>;
};

function firstSearchParam(value: SearchParams[string]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function InviteProfilePage({
  params,
  searchParams,
}: Props) {
  const { token } = await params;
  const rawSearchParams = await searchParams;
  const sp = {
    error: firstSearchParam(rawSearchParams.error),
  };
  const session = await requireAuthenticatedSession();
  const queryClient = getQueryClient();
  const inviteData = await queryClient
    .fetchQuery(
      trpc.team.getInviteProfileCompletion.queryOptions({
        token,
      }),
    )
    .catch(() => null);

  if (inviteData && !inviteData.ok && inviteData.reason === "email-mismatch") {
    redirect(
      `/join/${token}?error=${encodeURIComponent(
        "This invite belongs to a different email address.",
      )}`,
    );
  }

  if (
    inviteData &&
    !inviteData.ok &&
    inviteData.reason === "invite-not-accepted"
  ) {
    redirect(`/join/${token}`);
  }

  if (!inviteData?.ok) {
    redirect("/");
  }

  const { agentProfile, employeeProfile, invite } = inviteData;

  const isAgentInvite = invite.role === "agent";
  const pageTitle = isAgentInvite
    ? "Complete your agent profile"
    : "Complete your employee profile";
  const pageDescription = isAgentInvite
    ? "Add the details that should appear on your company site and dashboard."
    : "Add the basic work details your company needs to recognize you in the workspace.";
  const assignedRoleLabel = isAgentInvite
    ? "Agent"
    : (WORK_ROLE_LABELS[invite.workRole] ?? invite.workRole);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <section className="w-full max-w-2xl border bg-background">
        <div className="px-6 pt-6">
          <h1 className="text-2xl font-semibold text-foreground">
            {pageTitle}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {pageDescription} You&apos;re joining{" "}
            <strong>{invite.companyName}</strong> as{" "}
            <strong className="capitalize">
              {isAgentInvite ? "agent" : "employee"}
            </strong>
            {!isAgentInvite ? (
              <>
                {" "}
                in{" "}
                <strong>
                  {WORK_ROLE_LABELS[invite.workRole] ?? invite.workRole}
                </strong>
              </>
            ) : null}
            .
          </p>
        </div>
        <div className="px-6 py-6">
          {sp.error ? (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{sp.error}</AlertDescription>
            </Alert>
          ) : null}

          <InviteProfileCompletionForm
            assignedRoleLabel={assignedRoleLabel}
            defaultBio={agentProfile?.bio}
            defaultImageUrl={agentProfile?.imageUrl}
            defaultName={
              (isAgentInvite ? agentProfile?.name : employeeProfile?.name) ??
              session.user.name ??
              ""
            }
            defaultPhone={
              (isAgentInvite ? agentProfile?.phone : employeeProfile?.phone) ??
              session.user.phoneNumber
            }
            email={invite.email}
            isAgentInvite={isAgentInvite}
            token={token}
          />
        </div>
        <div className="px-6 pb-6 text-xs text-muted-foreground">
          You can update these details later from the dashboard.
        </div>
      </section>
    </main>
  );
}
