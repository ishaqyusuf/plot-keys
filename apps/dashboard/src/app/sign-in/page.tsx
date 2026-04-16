import { authRoutes } from "@plotkeys/auth/shared";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { buildPlatformAppUrl } from "@plotkeys/utils";
import { resolveDashboardLandingRoute } from "@plotkeys/utils";
import { CheckCircle2 } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignInForm } from "../../components/auth/sign-in-form";
import { getCurrentAppSession, getTenantSlugFromHost } from "../../lib/session";
import { getTenantSignInUrlForSubdomain } from "../../lib/tenant-dashboard-url";

type SignInPageProps = {
  searchParams?: Promise<{
    error?: string;
    redirect?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const headerStore = await headers();
  const tenantSlug = await getTenantSlugFromHost();
  const session = await getCurrentAppSession();

  if (session?.activeMembership) {
    const landingRoute = resolveDashboardLandingRoute(
      session.activeMembership.workRole,
    );

    if (tenantSlug) {
      redirect(landingRoute);
    }

    redirect(
      await getTenantSignInUrlForSubdomain(
        session.activeMembership.companySlug,
        landingRoute,
      ),
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

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--primary)_10%,transparent)_0%,transparent_28%)] px-6 py-8 md:px-8 md:py-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          aria-label="Go to homepage"
          className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm text-foreground shadow-sm backdrop-blur transition hover:border-primary hover:text-primary"
          href="/"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary)_0%,color-mix(in_srgb,var(--primary)_70%,white)_100%)] text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground">
            PK
          </span>
          <span className="font-medium uppercase tracking-[0.18em]">
            PlotKeys
          </span>
        </Link>
        {!tenantSlug ? (
          <Button asChild className="hidden sm:inline-flex" variant="secondary">
            <Link href={createWorkspaceHref}>Create workspace</Link>
          </Button>
        ) : null}
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_0.8fr] lg:items-center">
        <section className="max-w-2xl">
          <Badge variant="secondary">Existing workspace</Badge>
          <h1 className="mt-5 font-serif text-4xl tracking-[-0.04em] text-foreground md:text-6xl">
            Sign in and continue your work.
          </h1>
          <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">
            Access the current tenant workspace, reopen pending onboarding, and
            continue from protected pages without extra steps.
          </p>

          <div className="mt-8 grid gap-3">
            {[
              "Tenant-aware sign-in keeps access scoped to the current workspace.",
              "Verified users return to onboarding or dashboard automatically.",
              "Dev account autofill remains available for matching tenant accounts.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card px-4 py-4 text-sm leading-7 text-muted-foreground"
              >
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center">
          <Card className="w-full rounded-[1.75rem] border-border bg-background shadow-[var(--shadow-card)]">
            <CardHeader className="px-7 pt-7 md:px-9 md:pt-9">
              <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">
                Login
              </p>
              <CardTitle className="mt-4 font-serif text-3xl tracking-[-0.04em] text-foreground md:text-4xl">
                Welcome back
              </CardTitle>
              <CardDescription className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
                Use your owner or staff account to open this workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-7 pb-7 md:px-9 md:pb-9">
              <SignInForm
                initialError={params.error}
                showCreateAccount={!tenantSlug}
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
