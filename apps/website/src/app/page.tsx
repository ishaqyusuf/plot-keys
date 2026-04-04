import { createPrismaClient } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { Separator } from "@plotkeys/ui/separator";
import {
  buildPlatformAppUrl,
  getPlanPricing,
  planTrialDays,
  tierLabels,
} from "@plotkeys/utils";
import { headers } from "next/headers";
import Link from "next/link";

import { DevTenantFab } from "../components/dev/dev-tenant-fab";

const highlights = [
  "Listings, CRM, agents, websites, and AI workflows in one operating system",
  "Launch branded tenant websites on subdomains or custom domains in minutes",
  "Capture leads from every property page and route them to the right team fast",
];

const metrics = [
  { label: "Website launch time", value: "1 day" },
  { label: "Tool sprawl reduced", value: "5-in-1" },
  { label: "Tenant-ready structure", value: "100%" },
];

const features = [
  {
    title: "Operate from one command center",
    description:
      "Track listings, clients, agents, appointments, and performance without stitching together disconnected tools.",
  },
  {
    title: "Publish polished property websites",
    description:
      "Turn your inventory into fast branded websites with reusable sections, clear information architecture, and clean mobile layouts.",
  },
  {
    title: "Automate content and lead flow",
    description:
      "Use AI-assisted content, intake workflows, and structured data to move from interest to follow-up without manual chaos.",
  },
];

const workflow = [
  {
    step: "01",
    title: "Set up your company workspace",
    description:
      "Create your tenant, invite your team, and organize the operating structure behind your agency.",
  },
  {
    step: "02",
    title: "Sync listings and media",
    description:
      "Bring your properties, galleries, and marketing details into one source of truth for sales and publishing.",
  },
  {
    step: "03",
    title: "Launch your branded website",
    description:
      "Choose a clean structure, publish to your PlotKeys subdomain, and connect a custom domain when you are ready.",
  },
];

const pricingPlans = [
  {
    description:
      "For smaller operators and spin-off brands that need a credible online presence fast.",
    features: [
      "Basic website presence",
      "Newsletter capture",
      "Listings visibility",
      "Starter templates",
      "No customer account system",
    ],
    subtitle: "Launch essentials",
    tier: "starter",
  },
  {
    description:
      "For growing teams that want branded customer journeys, payments, and stronger digital operations.",
    features: [
      "Customer accounts",
      "Website payments",
      "Estate-management experiences",
      "Custom domain connection",
      "Plus templates",
    ],
    subtitle: "Growth-ready workspace",
    tier: "plus",
  },
  {
    description:
      "For serious brands ready to add AI-powered workflows and the strongest website presentation.",
    features: [
      "Everything in Plus",
      "AI-powered features",
      "Pro templates",
      "Premium presentation tools",
      "Priority expansion path",
    ],
    subtitle: "Premium operating layer",
    tier: "pro",
  },
] as const;

export default async function MarketingHomePage() {
  const headerStore = await headers();
  const prisma = createPrismaClient().db!;
  const tenants = await prisma.company.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      planTier: true,
      slug: true,
    },
    where: {
      deletedAt: null,
      isActive: true,
    },
  });
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");
  const currentOrigin = host ? `${protocol}://${host}` : null;
  const createWorkspaceHref = buildPlatformAppUrl({
    currentOrigin,
    pathname: "/sign-up",
  });

  return (
    <>
      <DevTenantFab
        tenants={tenants.map((tenant) => ({
          id: tenant.id,
          name: tenant.name,
          planTier: tenant.planTier,
          subdomain: tenant.slug,
        }))}
      />
      <main className="min-h-screen bg-background text-foreground">

        {/* Nav */}
        <header className="border-b border-border bg-background">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div>
              <span className="text-sm font-semibold tracking-tight">PlotKeys</span>
              <p className="text-xs text-muted-foreground">Real-estate operating system</p>
            </div>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="transition-colors hover:text-foreground">Features</a>
              <a href="#workflow" className="transition-colors hover:text-foreground">Workflow</a>
              <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
              <Button asChild size="sm">
                <Link href={createWorkspaceHref}>Get started</Link>
              </Button>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="border-b border-border px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <Badge variant="secondary" className="mb-6">
                  Built for agencies, developers, and property teams
                </Badge>
                <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
                  Run the business.
                  <br />
                  Launch the website.
                  <br />
                  Capture every lead.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-7 text-muted-foreground">
                  PlotKeys unifies listings, CRM, agents, appointments, AI
                  content, and branded property websites in one clean workflow.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link href={createWorkspaceHref}>Create workspace</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="#features">Explore platform</Link>
                  </Button>
                </div>
                <ul className="mt-8 flex flex-col gap-2">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-muted-foreground">Live tenant website</CardTitle>
                    <Badge variant="secondary">company.plotkeys.app</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="rounded-lg border border-border bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground">Featured property</p>
                    <h2 className="mt-2 text-xl font-semibold leading-snug text-foreground">
                      Elegant homes, credible brand, smoother lead flow.
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Every listing, testimonial, CTA, and neighborhood story is
                      presented in a structured layout that feels premium on both
                      desktop and mobile.
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {metrics.map((metric) => (
                        <div key={metric.label} className="rounded-md border border-border bg-background p-3">
                          <p className="text-lg font-semibold text-foreground">{metric.value}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{metric.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Lead capture status</p>
                      <p className="mt-0.5 text-sm font-medium text-foreground">Routing to assigned agent</p>
                    </div>
                    <Badge>Live</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-b border-border px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10">
              <p className="text-sm font-medium text-muted-foreground">Why teams choose PlotKeys</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                A cleaner system for operations and public presence.
              </h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="border-border">
                  <CardHeader>
                    <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted">
                      <span className="text-xs font-medium text-muted-foreground">
                        {String(features.indexOf(feature) + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <CardTitle className="mt-4 text-base">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-6">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section id="workflow" className="border-b border-border bg-muted/30 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Simple workflow</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  From setup to launch without the usual platform mess.
                </h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  PlotKeys is designed to give small and growing real-estate teams
                  a clear path from internal operations to a public-ready website.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {workflow.map((item) => (
                  <div key={item.step} className="rounded-lg border border-border bg-background px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono text-xs">{item.step}</Badge>
                      <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-b border-border px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10">
              <p className="text-sm font-medium text-muted-foreground">Pricing</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Choose the operating layer that matches your growth stage.
              </h2>
              <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                Start with a clean public presence, then expand into payments,
                custom domains, and AI-assisted workflows as your company grows.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {pricingPlans.map((plan) => {
                const pricing = getPlanPricing(plan.tier);
                const isPro = plan.tier === "pro";
                const tierLabel = tierLabels[plan.tier];

                return (
                  <Card
                    key={plan.tier}
                    className={isPro ? "border-foreground" : "border-border"}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {plan.subtitle}
                          </p>
                          <CardTitle className="mt-2 text-xl">{tierLabel}</CardTitle>
                        </div>
                        {isPro && <Badge>Most complete</Badge>}
                      </div>
                      <div className="mt-4">
                        <span className="text-4xl font-semibold tracking-tight text-foreground">
                          {pricing.monthly.formatted}
                        </span>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {`${planTrialDays}-day free trial · ${pricing.annual.formatted}/yr · save ${pricing.annualDiscountPercent}%`}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <CardDescription className="leading-6">{plan.description}</CardDescription>
                      <Separator />
                      <ul className="flex flex-col gap-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                            <span className="size-1.5 shrink-0 rounded-full bg-foreground" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button asChild className="w-full mt-2" variant={isPro ? "default" : "outline"}>
                        <Link href={createWorkspaceHref}>
                          {`Start ${planTrialDays}-day trial`}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="launch" className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="border-border bg-muted/30">
                <CardHeader>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Built for trust</p>
                  <CardTitle className="mt-2 text-2xl leading-snug">
                    Your website should feel as premium as the properties you market.
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-6">
                    PlotKeys pairs a disciplined multi-tenant foundation with
                    polished website presentation, so every company gets a
                    credible digital storefront without rebuilding from scratch.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Ready to launch</p>
                  <CardTitle className="mt-2 text-xl">
                    Start with a clean foundation and scale from there.
                  </CardTitle>
                  <CardDescription className="mt-2 leading-6">
                    Use PlotKeys to centralize operations now, then expand into
                    branded websites, custom domains, AI assistance, and deeper
                    automation as your team grows.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <Link href={createWorkspaceHref}>Create workspace</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/contact">Talk to sales</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
