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
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { WORK_ROLE_LABELS } from "@plotkeys/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAuthenticatedSession } from "../../../../lib/session";
import { completeInviteProfileAction } from "../../../actions";

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

          <form action={completeInviteProfileAction} className="space-y-6">
            <input name="token" type="hidden" value={token} />

            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input disabled value={invite.email} />
              </Field>

              <Field>
                <FieldLabel>Name *</FieldLabel>
                <Input
                  defaultValue={
                    (isAgentInvite
                      ? agentProfile?.name
                      : employeeProfile?.name) ??
                    session.user.name ??
                    ""
                  }
                  name="name"
                  placeholder="Your full name"
                  required
                />
              </Field>

              <Field>
                <FieldLabel>
                  {isAgentInvite ? "Professional title" : "Job title"}
                </FieldLabel>
                <Input
                  defaultValue={
                    isAgentInvite
                      ? (agentProfile?.title ?? "")
                      : (employeeProfile?.title ?? "")
                  }
                  name="title"
                  placeholder={
                    isAgentInvite
                      ? "e.g. Senior Sales Advisor"
                      : "e.g. Operations Executive"
                  }
                />
              </Field>

              <Field>
                <FieldLabel>Phone</FieldLabel>
                <Input
                  defaultValue={
                    (isAgentInvite
                      ? agentProfile?.phone
                      : employeeProfile?.phone) ??
                    session.user.phoneNumber ??
                    ""
                  }
                  name="phone"
                  placeholder="+2348012345678"
                  type="tel"
                />
              </Field>

              {isAgentInvite ? (
                <>
                  <Field>
                    <FieldLabel>Bio</FieldLabel>
                    <Input
                      defaultValue={agentProfile?.bio ?? ""}
                      name="bio"
                      placeholder="Short professional bio"
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Photo URL</FieldLabel>
                    <Input
                      defaultValue={agentProfile?.imageUrl ?? ""}
                      name="imageUrl"
                      placeholder="https://..."
                      type="url"
                    />
                  </Field>
                </>
              ) : null}
            </FieldGroup>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="ghost">
                <Link href="/">Skip for now</Link>
              </Button>
              <Button type="submit">Save and continue</Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          You can update these details later from the dashboard.
        </CardFooter>
      </Card>
    </main>
  );
}
