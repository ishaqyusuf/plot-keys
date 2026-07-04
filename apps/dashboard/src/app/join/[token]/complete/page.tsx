import { getTeamInviteProfileCompletionData } from "@plotkeys/db/queries";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { WORK_ROLE_LABELS } from "@plotkeys/utils";
import { redirect } from "next/navigation";

import { requireAuthenticatedSession } from "@/lib/session";

import { InviteProfileCompletionForm } from "./invite-profile-completion-form";

type InviteProfilePageProps = {
  params: Promise<{ token: string }>;
  searchParams?: Promise<{ error?: string }>;
};

export default async function InviteProfilePage({
  params,
  searchParams,
}: InviteProfilePageProps) {
  const { token } = await params;
  const sp = (await searchParams) ?? {};
  const session = await requireAuthenticatedSession();

  const inviteData = await getTeamInviteProfileCompletionData({
    token,
    userEmail: session.user.email,
  });

  if (!inviteData.ok && inviteData.reason === "email-mismatch") {
    redirect(
      `/join/${token}?error=${encodeURIComponent(
        "This invite belongs to a different email address.",
      )}`,
    );
  }

  if (!inviteData.ok && inviteData.reason === "invite-not-accepted") {
    redirect(`/join/${token}`);
  }

  if (!inviteData.ok) {
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
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{pageTitle}</CardTitle>
          <CardDescription>
            {pageDescription} You&apos;re joining{" "}
            <strong>{invite.company.name}</strong> as{" "}
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
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sp.error ? (
            <Alert className="mb-6" variant="destructive">
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
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          You can update these details later from the dashboard.
        </CardFooter>
      </Card>
    </main>
  );
}
