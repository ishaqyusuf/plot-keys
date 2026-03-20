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
import { redirect } from "next/navigation";
import { acceptInviteAction } from "../../actions";
import { getCurrentAppSession } from "../../../lib/session";

type JoinPageProps = {
  params: Promise<{ token: string }>;
  searchParams?: Promise<{ error?: string }>;
};

export default async function JoinPage({ params, searchParams }: JoinPageProps) {
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

  if (invite.acceptedAt) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle>Already accepted</CardTitle>
            <CardDescription>
              This invite has already been accepted.
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
              This invite has expired or been revoked. Please ask your team admin
              to send a new invite.
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

  if (!session) {
    redirect(`/sign-in?redirect=/join/${token}`);
  }

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

        {sp.error ? (
          <CardContent>
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
              {sp.error}
            </p>
          </CardContent>
        ) : null}

        <CardFooter className="flex flex-col gap-3">
          <form action={acceptInviteAction} className="w-full">
            <input type="hidden" name="token" value={token} />
            <Button className="w-full" type="submit">
              Accept invite
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground">
            Signed in as <strong>{session.user.email}</strong>.{" "}
            <Link className="underline underline-offset-2" href="/sign-out">
              Sign out
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
