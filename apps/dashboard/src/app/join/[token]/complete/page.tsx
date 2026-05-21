import { createPrismaClient } from "@plotkeys/db";
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
import { requireAuthenticatedSession } from "../../../../lib/session";
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
  const prisma = createPrismaClient().db;

  const invite = prisma
    ? await prisma.teamInvite.findUnique({
        include: {
          company: {
            select: { id: true, name: true },
          },
        },
        where: { token },
      })
    : null;

  if (!invite) {
    redirect("/");
  }

  if (invite.email.toLowerCase() !== session.user.email.toLowerCase()) {
    redirect(
      `/join/${token}?error=${encodeURIComponent(
        "This invite belongs to a different email address.",
      )}`,
    );
  }

  if (!invite.acceptedAt) {
    redirect(`/join/${token}`);
  }

  if (invite.role !== "agent" && invite.role !== "staff") {
    redirect("/");
  }

  const isAgentInvite = invite.role === "agent";
  const agentProfile =
    prisma && isAgentInvite
      ? await prisma.agent.findFirst({
          where: {
            companyId: invite.companyId,
            deletedAt: null,
            email: invite.email,
          },
        })
      : null;
  const employeeProfile =
    prisma && !isAgentInvite
      ? await prisma.employee.findFirst({
          where: {
            companyId: invite.companyId,
            deletedAt: null,
            email: invite.email,
          },
        })
      : null;
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
