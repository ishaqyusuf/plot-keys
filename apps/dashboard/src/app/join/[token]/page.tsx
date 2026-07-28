import "server-only";

import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Button } from "@plotkeys/ui/button";
import type { Metadata } from "next";
import Link from "next/link";
import type { SearchParams } from "nuqs";

import { getCurrentAppSession } from "@/lib/session";
import { getTenantSignInUrlForSubdomain } from "@/lib/tenant-dashboard-url";
import { getQueryClient, trpc } from "@/trpc/server";

import { AcceptInviteButton } from "./accept-invite-button";
import { InviteSignUpForm } from "./invite-sign-up-form";

export const metadata: Metadata = {
  title: "Join Workspace | Plot Keys",
};

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<SearchParams>;
};

function firstSearchParam(value: SearchParams[string]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function JoinPage({ params, searchParams }: Props) {
  const { token } = await params;
  const rawSearchParams = await searchParams;
  const sp = {
    error: firstSearchParam(rawSearchParams.error),
  };
  const session = await getCurrentAppSession();
  const queryClient = getQueryClient();
  const invite = await queryClient
    .fetchQuery(trpc.team.getInviteByToken.queryOptions({ token }))
    .catch(() => null);

  if (!invite) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <section className="w-full max-w-sm border bg-background text-center">
          <div className="px-6 pt-6">
            <h1 className="text-2xl font-semibold text-foreground">
              Invite not found
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This invite link is invalid or has already been used.
            </p>
          </div>
          <div className="flex justify-center px-6 py-6">
            <Button asChild>
              <Link href="/">Go to dashboard</Link>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  if (invite.isRevoked || invite.isExpired) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <section className="w-full max-w-sm border bg-background text-center">
          <div className="px-6 pt-6">
            <h1 className="text-2xl font-semibold text-foreground">
              Invite expired
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This invite has expired or been revoked. Please ask your team
              admin to send a new invite.
            </p>
          </div>
          <div className="flex justify-center px-6 py-6">
            <Button variant="outline" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  const companyName = invite.companyName;
  const role = invite.role;
  const redirectTo = `/join/${token}`;
  const signInHref = await getTenantSignInUrlForSubdomain(
    invite.companySlug,
    redirectTo,
  );
  const profileCompletionHref =
    role === "agent" || role === "staff" ? `/join/${token}/complete` : "/";

  const isSignedInWithInviteEmail = session
    ? session.user.email.toLowerCase() === invite.email.toLowerCase()
    : false;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <section className="w-full max-w-sm border bg-background">
        <div className="px-6 pt-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="text-2xl font-bold">
              {companyName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            Join {companyName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You've been invited to join <strong>{companyName}</strong> as{" "}
            <strong className="capitalize">{role}</strong>. Accept to get
            started.
          </p>
        </div>

        {!session ? (
          <div className="space-y-5 px-6 py-6">
            <p className="text-sm text-muted-foreground">
              Create your account for <strong>{invite.email}</strong> to accept
              this invitation.
            </p>
            <InviteSignUpForm
              companyName={invite.companyName}
              companySlug={invite.companySlug}
              email={invite.email}
              token={token}
            />
            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link className="underline underline-offset-2" href={signInHref}>
                Sign in instead
              </Link>
            </p>
          </div>
        ) : null}

        {session && !isSignedInWithInviteEmail ? (
          <div className="px-6 py-6">
            <Alert variant="destructive">
              <AlertDescription className="text-center">
                This invite was sent to {invite.email}. Sign out and continue
                with that email to accept it.
              </AlertDescription>
            </Alert>
          </div>
        ) : null}

        {sp.error ? (
          <div className="px-6 py-6">
            <Alert variant="destructive">
              <AlertDescription className="text-center">
                {sp.error}
              </AlertDescription>
            </Alert>
          </div>
        ) : null}

        {session && isSignedInWithInviteEmail ? (
          <div className="flex flex-col gap-3 px-6 py-6">
            {invite.isAccepted ? (
              <Button className="w-full" asChild>
                <Link href={profileCompletionHref}>
                  {role === "agent" || role === "staff"
                    ? "Continue profile setup"
                    : "Go to dashboard"}
                </Link>
              </Button>
            ) : (
              <AcceptInviteButton role={role} token={token} />
            )}
            <p className="text-center text-xs text-muted-foreground">
              Signed in as <strong>{session.user.email}</strong>.{" "}
              <Link className="underline underline-offset-2" href="/sign-out">
                Sign out
              </Link>
            </p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
