import { createPrismaClient } from "@plotkeys/db";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import Link from "next/link";
import { getCurrentAppSession } from "../../../lib/session";
import { acceptInviteAction } from "../../actions";

type JoinPageProps = {
  params: Promise<{ token: string }>;
  searchParams?: Promise<{ error?: string }>;
};

export default async function JoinPage({
  params,
  searchParams,
}: JoinPageProps) {
  const { token } = await params;
  const sp = (await searchParams) ?? {};
  const session = await getCurrentAppSession();

  const prisma = createPrismaClient().db;

  const invite = prisma
    ? await prisma.teamInvite.findUnique({
        where: { token },
        include: { company: { select: { name: true } } },
      })
    : null;

  if (!invite) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle>Invite not found</CardTitle>
            <CardDescription>
              This invite link is invalid or has already been used.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/">Go to dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  if (invite.revokedAt || invite.expiresAt < new Date()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle>Invite expired</CardTitle>
            <CardDescription>
              This invite has expired or been revoked. Please ask your team
              admin to send a new invite.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild variant="outline">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  const companyName = invite.company.name;
  const role = invite.role;
  const redirectTo = `/join/${token}`;
  const signInHref = `/sign-in?redirect=${encodeURIComponent(redirectTo)}`;
  const signUpHref = `/sign-up?redirect=${encodeURIComponent(redirectTo)}`;
  const profileCompletionHref =
    role === "agent" || role === "staff" ? `/join/${token}/complete` : "/";

  const isSignedInWithInviteEmail = session
    ? session.user.email.toLowerCase() === invite.email.toLowerCase()
    : false;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="text-2xl font-bold">
              {companyName.charAt(0).toUpperCase()}
            </span>
          </div>
          <CardTitle>Join {companyName}</CardTitle>
          <CardDescription>
            You've been invited to join <strong>{companyName}</strong> as{" "}
            <strong className="capitalize">{role}</strong>. Accept to get
            started.
          </CardDescription>
        </CardHeader>

        {!session ? (
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Sign in to an existing PlotKeys account or create one with{" "}
              <strong>{invite.email}</strong> to accept this invitation.
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link href={signInHref}>Sign in to continue</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href={signUpHref}>Create account</Link>
              </Button>
            </div>
          </CardContent>
        ) : null}

        {session && !isSignedInWithInviteEmail ? (
          <CardContent>
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
              This invite was sent to {invite.email}. Sign out and continue with
              that email to accept it.
            </p>
          </CardContent>
        ) : null}

        {sp.error ? (
          <CardContent>
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
              {sp.error}
            </p>
          </CardContent>
        ) : null}

        {session && isSignedInWithInviteEmail ? (
          <CardFooter className="flex flex-col gap-3">
            {invite.acceptedAt ? (
              <Button asChild className="w-full">
                <Link href={profileCompletionHref}>
                  {role === "agent" || role === "staff"
                    ? "Continue profile setup"
                    : "Go to dashboard"}
                </Link>
              </Button>
            ) : (
              <form action={acceptInviteAction} className="w-full">
                <input type="hidden" name="role" value={role} />
                <input type="hidden" name="token" value={token} />
                <Button className="w-full" type="submit">
                  Accept invite
                </Button>
              </form>
            )}
            <p className="text-center text-xs text-muted-foreground">
              Signed in as <strong>{session.user.email}</strong>.{" "}
              <Link className="underline underline-offset-2" href="/sign-out">
                Sign out
              </Link>
            </p>
          </CardFooter>
        ) : null}
      </Card>
    </main>
  );
}
