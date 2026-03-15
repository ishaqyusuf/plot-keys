import { createPrismaClient } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card } from "@plotkeys/ui/card";
import { SectionHeading } from "@plotkeys/ui/section-heading";
import { isVercelDomainProvisioningConfigured } from "@plotkeys/utils";
import Link from "next/link";
import { NotificationDemo } from "../components/notification-demo";
import { requireOnboardedSession } from "../lib/session";
import {
  ensureBuilderConfigurationExists,
  signOutAction,
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
          <Alert className="mb-6" variant="success">
            <AlertDescription>Tenant domain sync completed.</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="bg-white/88">
            <div className="p-8 md:p-10">
              <Badge variant="primary">Tenant dashboard</Badge>
              <h1 className="mt-5 max-w-3xl font-serif text-5xl text-slate-950 md:text-6xl">
                {session.activeMembership.companyName} is ready for editing and
                publishing.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                You have completed the first tenant journey: account creation,
                verification, onboarding, and starter website bootstrap. The
                next operational surface is the builder.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
                <form action={signOutAction}>
                  <Button type="submit" variant="ghost">
                    Sign out
                  </Button>
                </form>
              </div>
            </div>
          </Card>

          <Card className="bg-[linear-gradient(145deg,#102033_0%,#0f766e_100%)] text-white">
            <div className="p-8 md:p-10">
              <p className="text-sm uppercase tracking-[0.32em] text-teal-100">
                Active workspace
              </p>
              <div className="mt-6 grid gap-4">
                {milestoneCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-[calc(var(--radius-md)-0.1rem)] border border-white/10 bg-white/8 px-5 py-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm uppercase tracking-[0.25em] text-slate-300">
                        {card.label}
                      </p>
                      <Badge
                        className="bg-white/12 text-white"
                        variant="neutral"
                      >
                        {card.value}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-200">
                      {card.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.92fr]">
          <Card className="bg-white/90">
            <div className="p-8">
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
                    className="rounded-[calc(var(--radius-md)-0.15rem)] border border-[color:var(--border)] bg-slate-50/80 px-5 py-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--surface-inverse)] text-sm font-semibold text-white">
                        0{index + 1}
                      </div>
                      <p className="text-base leading-7 text-slate-700">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <NotificationDemo />
            </div>
          </Card>

          <Card className="bg-[#fff7ed]">
            <div className="p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-amber-700">
                    Tenant domains
                  </p>
                  <p className="mt-3 text-base leading-7 text-slate-700">
                    Website and dashboard hostnames are now tracked per tenant.
                    Provision them in Vercel when the integration env vars are
                    ready.
                  </p>
                </div>
                <Badge
                  variant={domainProvisioningConfigured ? "success" : "neutral"}
                >
                  {domainProvisioningConfigured ? "Ready" : "Env needed"}
                </Badge>
              </div>
              <div className="mt-6 grid gap-3">
                {(domainStatuses ?? []).map((domain) => (
                  <div
                    key={domain.id}
                    className="rounded-[calc(var(--radius-md)-0.15rem)] border border-amber-200 bg-white/70 px-4 py-4 text-base text-slate-700"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-900">
                        {domain.hostname}
                      </p>
                      <Badge
                        className={
                          domain.status === "failed"
                            ? "border-rose-200 bg-rose-50 text-rose-800"
                            : undefined
                        }
                        variant={
                          domain.status === "active" ? "success" : "neutral"
                        }
                      >
                        {domain.status}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {domain.kind} via {domain.vercelProjectKey}
                    </p>
                    {domain.lastError ? (
                      <p className="mt-2 text-sm text-rose-700">
                        {domain.lastError}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
            </div>
          </Card>

          <Card className="bg-[#fff7ed]">
            <div className="p-8">
              <p className="text-sm uppercase tracking-[0.32em] text-amber-700">
                Next implementation lane
              </p>
              <ul className="mt-6 grid gap-3">
                {[
                  "Replace the local verification/session approach with real Better Auth route wiring.",
                  "Move public and dashboard runtime lookup fully onto tenant domain records.",
                  "Feed derived sections from live property and company records.",
                  "Upgrade the smart-fill button from deterministic copy to real AI generation.",
                ].map((item) => (
                  <li
                    key={item}
                    className="rounded-[calc(var(--radius-md)-0.15rem)] border border-amber-200 bg-white/70 px-4 py-4 text-base text-slate-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
