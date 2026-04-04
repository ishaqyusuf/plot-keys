import { authRoutes } from "@plotkeys/auth/shared";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { Icon } from "@plotkeys/ui/icons";
import { buildPlatformAppUrl } from "@plotkeys/utils";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignInForm } from "../../components/auth/sign-in-form";
import { getCurrentAppSession, getTenantSlugFromHost } from "../../lib/session";

type SignInPageProps = {
  searchParams?: Promise<{
    error?: string;
    redirect?: string;
  }>;
};

const benefits = [
  "Tenant-aware sign-in keeps access scoped to the current workspace.",
  "Verified users return to onboarding or dashboard automatically.",
  "Dev account autofill remains available for matching tenant accounts.",
];

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const headerStore = await headers();
  const tenantSlug = await getTenantSlugFromHost();
  const session = await getCurrentAppSession();

  if (session?.activeMembership) {
    return (
      <meta content={`0;url=${authRoutes.dashboardHome}`} httpEquiv="refresh" />
    );
  }

  const params = (await searchParams) ?? {};
  const currentOrigin = (() => {
    const host =
      headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "";
    const protocol =
      headerStore.get("x-forwarded-proto") ??
      (process.env.NODE_ENV === "development" ? "http" : "https");

    return host ? `${protocol}://${host}` : null;
  })();
  const createWorkspaceHref = buildPlatformAppUrl({
    currentOrigin,
    pathname: "/sign-up",
  });

  if (!tenantSlug) {
    redirect(createWorkspaceHref);
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8 md:px-8 md:py-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          aria-label="Go to homepage"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
          href="/"
        >
          <div className="flex size-7 items-center justify-center rounded-md bg-foreground text-background text-xs font-semibold">
            PK
          </div>
          PlotKeys
        </Link>
        {!tenantSlug ? (
          <Button asChild className="hidden sm:inline-flex" variant="outline" size="sm">
            <Link href={createWorkspaceHref}>Create workspace</Link>
          </Button>
        ) : null}
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-start">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Sign in and continue your work.
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Access the current tenant workspace, reopen pending onboarding, and
            continue from protected pages without extra steps.
          </p>

          <ul className="mt-8 flex flex-col gap-3">
            {benefits.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm leading-6 text-muted-foreground"
              >
                <Icon.CheckCircle className="mt-0.5 size-4 shrink-0 text-foreground" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <Card className="border-border">
          <CardHeader>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Login
            </p>
            <CardTitle className="mt-3 text-2xl tracking-tight">Welcome back</CardTitle>
            <CardDescription className="leading-6">
              Use your owner or staff account to open this workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm
              initialError={params.error}
              showCreateAccount={!tenantSlug}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
