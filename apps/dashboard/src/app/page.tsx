import { createPrismaClient } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { SectionHeading } from "@plotkeys/ui/section-heading";
import { isVercelDomainProvisioningConfigured } from "@plotkeys/utils";
import Link from "next/link";
import { SignOutButton } from "../components/auth/sign-out-button";
import { NotificationDemo } from "../components/notification-demo";
import { requireOnboardedSession } from "../lib/session";
import {
  ensureBuilderConfigurationExists,
  syncTenantDomainsAction,
} from "./actions";

const milestoneCards = [
  {
    detail:
      "Account creation, verification, and onboarding routes are now wired into a single session flow.",
    label: "Tenant entry",
    value: "Live",
  },
  {
    detail:
      "Template drafts can now be created, edited, and published from the builder.",
    label: "Builder",
    value: "Live",
  },
  {
    detail:
      "Published site content is ready to drive the tenant website renderer.",
    label: "Public site",
    value: "Connected",
  },
];

type DashboardHomePageProps = {
  searchParams?: Promise<{
    domains?: string;
    error?: string;
  }>;
};

export default async function DashboardHomePage({
  searchParams,
}: DashboardHomePageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};

  await ensureBuilderConfigurationExists();

  const domainProvisioningConfigured = isVercelDomainProvisioningConfigured();
  const domainStatuses = await createPrismaClient().db?.tenantDomain.findMany({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      companyId: session.activeMembership.companyId,
      deletedAt: null,
    },
  });

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        {params.error ? (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        {params.domains ? (
          <Alert className="mb-6 border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>Tenant domain sync completed.</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="bg-card">
            <CardHeader className="px-8 pt-8 md:px-10 md:pt-10">
              <Badge variant="default">Tenant dashboard</Badge>
              <CardTitle className="mt-5 max-w-3xl font-serif text-5xl text-foreground md:text-6xl">
                {session.activeMembership.companyName} is ready for editing and
                publishing.
              </CardTitle>
              <CardDescription className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                You have completed the first tenant journey: account creation,
                verification, onboarding, and starter website bootstrap. The
                next operational surface is the builder.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 px-8 pb-8 md:px-10 md:pb-10 sm:flex-row">
              <Button asChild>
                <Link href="/builder">Open template builder</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link
                  href={`/live?subdomain=${session.activeMembership.companySlug}`}
                >
                  Open live site preview
                </Link>
              </Button>
              <SignOutButton />
            </CardContent>
          </Card>

          <Card className="border-transparent bg-[linear-gradient(145deg,color-mix(in_srgb,var(--foreground)_94%,black)_0%,var(--primary)_100%)] text-primary-foreground">
            <CardHeader className="px-8 pt-8 pb-0 md:px-10 md:pt-10">
              <p className="text-sm uppercase tracking-[0.32em] text-primary-foreground/80">
                Active workspace
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 px-8 pb-8 pt-6 md:px-10 md:pb-10">
              {milestoneCards.map((card) => (
                <Card
                  key={card.label}
                  className="gap-3 border-primary-foreground/10 bg-primary-foreground/10 py-5 text-primary-foreground shadow-none"
                >
                  <CardHeader className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 pb-0">
                    <p className="text-sm uppercase tracking-[0.25em] text-primary-foreground/70">
                      {card.label}
                    </p>
                    <Badge className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground" variant="outline">
                      {card.value}
                    </Badge>
                  </CardHeader>
                  <CardContent className="px-5 text-sm leading-7 text-primary-foreground/80">
                    {card.detail}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.92fr]">
          <Card className="bg-card">
            <CardContent className="px-8 py-8 md:px-8">
              <SectionHeading
                eyebrow="Current tenant state"
                title="The first publishable website workflow is now active."
                description="Create template drafts, update the editable content contract, and publish a replacement site configuration without losing the current live version until confirmation."
              />
              <div className="mt-8 grid gap-4">
                {[
                  "One company per tenant, scoped through membership.",
                  "Multiple site configurations per tenant, one published at a time.",
                  "Template catalog in section registry, tenant content persisted in Prisma.",
                  "Live site preview available through the public renderer.",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-[calc(var(--radius-md)-0.15rem)] border border-border bg-muted/40 px-5 py-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
                        0{index + 1}
                      </div>
                      <p className="text-base leading-7 text-foreground">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <NotificationDemo />
            </CardContent>
          </Card>

          <Card className="bg-accent/10">
            <CardHeader className="px-8 pt-8 md:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-accent-foreground">
                    Tenant domains
                  </p>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">
                    Website and dashboard hostnames are now tracked per tenant.
                    Provision them in Vercel when the integration env vars are
                    ready.
                  </p>
                </div>
                <Badge
                  variant={domainProvisioningConfigured ? "default" : "outline"}
                >
                  {domainProvisioningConfigured ? "Ready" : "Env needed"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 px-8 pb-8 md:px-8">
              <div className="grid gap-3">
                {(domainStatuses ?? []).map((domain) => (
                  <Card
                    key={domain.id}
                    className="gap-2 border-border bg-card py-4 text-base text-foreground shadow-none"
                  >
                    <CardHeader className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 pb-0">
                      <p className="font-semibold text-foreground">
                        {domain.hostname}
                      </p>
                      <Badge
                        className={
                          domain.status === "failed"
                            ? "border-destructive/20 bg-destructive/10 text-destructive"
                            : undefined
                        }
                        variant={
                          domain.status === "active" ? "default" : "outline"
                        }
                        >
                        {domain.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="px-4 text-sm text-muted-foreground">
                      {domain.kind} via {domain.vercelProjectKey}
                    </CardContent>
                    {domain.lastError ? (
                      <CardContent className="px-4 pt-0 text-sm text-destructive">
                        {domain.lastError}
                      </CardContent>
                    ) : null}
                  </Card>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <form action={syncTenantDomainsAction}>
                  <Button type="submit">Provision or refresh domains</Button>
                </form>
                <Button asChild variant="secondary">
                  <Link
                    href={`/live?hostname=${session.activeMembership.companySlug}.plotkeys.com`}
                  >
                    Preview hostname-aware live page
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent/10">
            <CardHeader className="px-8 pt-8 pb-0 md:px-8">
              <CardTitle className="text-sm uppercase tracking-[0.32em] text-accent-foreground">
                Next implementation lane
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8 md:px-8">
              <ul className="grid gap-3">
                {[
                  "Replace the local verification/session approach with real Better Auth route wiring.",
                  "Move public and dashboard runtime lookup fully onto tenant domain records.",
                  "Feed derived sections from live property and company records.",
                  "Upgrade the smart-fill button from deterministic copy to real AI generation.",
                ].map((item) => (
                  <li
                    key={item}
                    className="rounded-[calc(var(--radius-md)-0.15rem)] border border-border bg-card px-4 py-4 text-base text-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
