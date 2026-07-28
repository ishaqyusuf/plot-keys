import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { PlotKeysLogo } from "@plotkeys/ui/plotkeys-logo";
import { ThemeToggle } from "@plotkeys/ui/theme-toggle";
import {
  buildPlatformAppUrl,
  resolveDashboardLandingRoute,
} from "@plotkeys/utils";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs";

import { SignInForm } from "@/components/auth/sign-in-form";
import { TenantLink as Link } from "@/components/nav/tenant-link";
import { TenantUrlProvider } from "@/components/nav/tenant-url-provider";
import { getCurrentAppSession, getTenantSlugFromHost } from "@/lib/session";
import { getTenantSignInUrlForSubdomain } from "@/lib/tenant-dashboard-url";
import {
  getCurrentTenantUrlContext,
  tenantRedirect,
} from "@/lib/tenant-url-server";

export const metadata: Metadata = {
  title: "Sign In | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

function firstSearchParam(value: SearchParams[string]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SignInPage({ searchParams }: Props) {
  const headerStore = await headers();
  const tenantSlug = await getTenantSlugFromHost();
  const session = await getCurrentAppSession();

  if (session?.activeMembership) {
    const landingRoute = resolveDashboardLandingRoute(
      session.activeMembership.workRole,
    );

    if (tenantSlug) {
      await tenantRedirect(landingRoute);
    }

    redirect(
      await getTenantSignInUrlForSubdomain(
        session.activeMembership.companySlug,
        landingRoute,
      ),
    );
  }

  const rawParams = await searchParams;
  const params = {
    error: firstSearchParam(rawParams.error),
  };
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
  const tenantUrl = await getCurrentTenantUrlContext();

  return (
    <TenantUrlProvider config={tenantUrl.config} context={tenantUrl.context}>
      <main className="min-h-screen bg-background px-6 py-8 md:px-8 md:py-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            aria-label="Go to homepage"
            className="inline-flex items-center gap-3 text-sm text-foreground transition hover:text-primary"
            href="/"
          >
            <PlotKeysLogo markClassName="h-8" wordmarkClassName="text-sm" />
          </Link>
          <div className="flex items-center gap-2">
            {!tenantSlug ? (
              <Button
                asChild
                variant="secondary"
                className="hidden sm:inline-flex"
              >
                <Link href={createWorkspaceHref}>Launch your website</Link>
              </Button>
            ) : null}
            <ThemeToggle />
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_0.8fr] lg:items-center">
          <section className="max-w-2xl">
            <h1 className="mt-5 font-serif text-4xl text-foreground md:text-6xl">
              Sign in and continue your work.
            </h1>
            <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">
              Access your company website dashboard, reopen pending setup, and
              continue from protected pages without extra steps.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                "Company-aware sign-in keeps access scoped to your website dashboard.",
                "Verified users return to onboarding or dashboard automatically.",
                "Dev account autofill remains available for matching tenant accounts.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 border-t border-border py-4 text-sm leading-7 text-muted-foreground first:border-t-0"
                >
                  <Icon.CheckCircle className="mt-1 size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="flex items-center">
            <div className="w-full">
              <div className="px-0 pt-0">
                <p className="text-sm font-medium text-muted-foreground">
                  Login
                </p>
                <h2 className="mt-4 font-serif text-3xl text-foreground md:text-4xl">
                  Welcome back
                </h2>
                <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
                  Use your owner or staff account to open your company
                  dashboard.
                </p>
              </div>
              <div className="mt-8">
                <SignInForm
                  initialError={params.error}
                  showCreateAccount={!tenantSlug}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </TenantUrlProvider>
  );
}
