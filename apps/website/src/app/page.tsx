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
import { SectionHeading } from "@plotkeys/ui/section-heading";
import {
  buildPlatformAppUrl,
  getPlanPricing,
  planTrialDays,
  tierLabels,
} from "@plotkeys/utils";
import { Check } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

import { AnimatedCounter } from "../components/animated-counter";
import { AnimatedOrbs } from "../components/animated-orbs";
import { ComingSoonPage } from "../components/coming-soon";
import { DevTenantFab } from "../components/dev/dev-tenant-fab";
import { ScrollReveal } from "../components/scroll-reveal";

const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON === "true";

/* ---------- Data ---------- */

const highlights = [
  "Listings, CRM, agents, websites, and AI workflows in one operating system",
  "Launch branded tenant websites on subdomains or custom domains in minutes",
  "Capture leads from every property page and route them to the right team fast",
];

const metrics = [
  { label: "Website launch time", value: 1, suffix: " day" },
  { label: "Tools consolidated", value: 5, suffix: "-in-1" },
  { label: "Tenant-ready", value: 100, suffix: "%" },
];

const features = [
  {
    num: "01",
    title: "Operate from one command center",
    description:
      "Track listings, clients, agents, appointments, and performance without stitching together disconnected tools.",
  },
  {
    num: "02",
    title: "Publish polished property websites",
    description:
      "Turn your inventory into fast branded websites with reusable sections, clear information architecture, and clean mobile layouts.",
  },
  {
    num: "03",
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

const browserAnnotations = [
  { label: "Template engine", position: "top-4 left-4" },
  { label: "Lead capture", position: "top-4 right-4" },
  { label: "Custom domain", position: "bottom-4 left-4" },
  { label: "AI content", position: "bottom-4 right-4" },
];

/* ---------- Page ---------- */

export default async function MarketingHomePage() {
  if (isComingSoon) {
    return <ComingSoonPage />;
  }

  const headerStore = await headers();
  const prisma = createPrismaClient().db!;
  const tenants = await prisma.company.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, planTier: true, slug: true },
    where: { deletedAt: null, isActive: true },
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
        tenants={tenants.map((t) => ({
          id: t.id,
          name: t.name,
          planTier: t.planTier,
          subdomain: t.slug,
        }))}
      />

      <main className="min-h-screen overflow-hidden bg-background text-foreground">
        {/* ═══════════════════ HERO ═══════════════════ */}
        <section className="relative px-6 py-16 md:px-10 md:py-24">
          <AnimatedOrbs variant="hero" />

          <div className="relative z-10 mx-auto max-w-6xl">
            {/* Nav */}
            <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.5em] text-primary">
                  PlotKeys
                </p>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  The operating system for modern real-estate companies.
                </p>
              </div>
              <nav className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                <a href="#features" className="transition hover:text-foreground">
                  Features
                </a>
                <a href="#workflow" className="transition hover:text-foreground">
                  Workflow
                </a>
                <a href="#pricing" className="transition hover:text-foreground">
                  Pricing
                </a>
                <a href="#launch" className="transition hover:text-foreground">
                  Launch
                </a>
                <Button asChild variant="secondary">
                  <Link href={createWorkspaceHref}>Create workspace</Link>
                </Button>
              </nav>
            </header>

            {/* Hero content */}
            <div className="mt-16 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <Badge className="animate-pulse-glow px-4 py-2 text-xs uppercase tracking-[0.3em]">
                  Built for agencies, developers, and property teams
                </Badge>

                <h1 className="mt-8 max-w-4xl font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-foreground md:text-7xl">
                  <span
                    className="animate-fade-in-up block"
                    style={{ animationDelay: "0.1s", animationFillMode: "both" }}
                  >
                    Run the business.
                  </span>
                  <span
                    className="animate-fade-in-up block"
                    style={{ animationDelay: "0.3s", animationFillMode: "both" }}
                  >
                    Launch the website.
                  </span>
                  <span
                    className="animate-fade-in-up block"
                    style={{ animationDelay: "0.5s", animationFillMode: "both" }}
                  >
                    Capture every lead.
                  </span>
                </h1>

                <p
                  className="animate-fade-in-up mt-8 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl"
                  style={{ animationDelay: "0.7s", animationFillMode: "both" }}
                >
                  PlotKeys unifies listings, CRM, agents, appointments, AI
                  content, and branded property websites in one clean workflow.
                </p>

                <div
                  className="animate-fade-in-up mt-8 flex flex-col gap-3 sm:flex-row"
                  style={{ animationDelay: "0.9s", animationFillMode: "both" }}
                >
                  <Button
                    asChild
                    className="px-8 py-4 text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  >
                    <Link href={createWorkspaceHref}>Create workspace</Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    className="px-8 py-4 text-base transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Link href="#features">Explore platform</Link>
                  </Button>
                </div>

                <ul className="mt-10 grid gap-3 text-sm text-foreground">
                  {highlights.map((item, i) => (
                    <li
                      key={item}
                      className="animate-fade-in-up flex items-start gap-3 rounded-2xl border border-border bg-card/60 px-4 py-3 backdrop-blur-sm"
                      style={{
                        animationDelay: `${1.1 + i * 0.15}s`,
                        animationFillMode: "both",
                      }}
                    >
                      <span className="mt-1 size-2.5 shrink-0 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mock panel */}
              <div
                className="animate-fade-in-up relative"
                style={{ animationDelay: "0.6s", animationFillMode: "both" }}
              >
                <div className="absolute -right-6 top-8 hidden h-28 w-28 rounded-full bg-primary/20 blur-3xl md:block" />
                <div className="absolute -left-4 bottom-8 hidden h-28 w-28 rounded-full bg-accent/20 blur-3xl md:block" />

                <div className="relative rounded-[2rem] bg-foreground p-6 text-background shadow-[var(--shadow-card)] md:p-8">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-primary-foreground/75">
                    <span>Live tenant website</span>
                    <span className="hidden sm:inline">company.plotkeys.app</span>
                  </div>

                  <div className="mt-8 rounded-[1.5rem] bg-background/10 p-5 ring-1 ring-background/10">
                    <p className="text-sm text-primary-foreground/70">Featured property</p>
                    <h2 className="mt-3 font-serif text-2xl leading-tight md:text-3xl">
                      Elegant homes, credible brand, smoother lead flow.
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-primary-foreground/75">
                      Every listing, testimonial, CTA, and neighborhood story is
                      presented in a structured layout that feels premium on both
                      desktop and mobile.
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between rounded-[1.5rem] border border-background/10 bg-background/10 px-5 py-4">
                    <div>
                      <p className="text-sm text-primary-foreground/70">Lead capture status</p>
                      <p className="mt-1 text-lg font-medium">Routing to assigned agent</p>
                    </div>
                    <div className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-primary-foreground">
                      Live
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics strip */}
            <div className="mt-16 grid gap-4 border-t border-border pt-10 sm:grid-cols-3">
              {metrics.map((metric, i) => (
                <ScrollReveal key={metric.label} delay={i * 0.15}>
                  <div className="text-center sm:text-left">
                    <p className="font-serif text-4xl text-foreground md:text-5xl">
                      <AnimatedCounter
                        target={metric.value}
                        suffix={metric.suffix}
                      />
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      {metric.label}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ TRUST STRIP ═══════════════════ */}
        <ScrollReveal>
          <section className="border-y border-foreground/10 bg-foreground px-6 py-10 text-center text-primary-foreground md:py-14">
            <p className="text-xs uppercase tracking-[0.4em] text-primary-foreground/60">
              The all-in-one platform
            </p>
            <p className="mx-auto mt-3 max-w-2xl font-serif text-2xl leading-snug tracking-[-0.03em] md:text-3xl">
              Built for agencies, developers &amp; property teams who refuse to
              stitch together disconnected tools.
            </p>
          </section>
        </ScrollReveal>

        {/* ═══════════════════ FEATURES ═══════════════════ */}
        <section id="features" className="px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <SectionHeading
                eyebrow="Why teams choose PlotKeys"
                title="A cleaner system for operations and public presence."
              />
            </ScrollReveal>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {features.map((feature, i) => (
                <ScrollReveal key={feature.title} delay={i * 0.15}>
                  <Card className="group relative gap-4 overflow-hidden rounded-[1.75rem] border-border bg-card py-8 shadow-[var(--shadow-card)] transition-transform duration-500 hover:translate-y-[-4px]">
                    {/* Watermark number */}
                    <span className="pointer-events-none absolute right-4 top-2 select-none font-serif text-[7rem] leading-none text-foreground/[0.04]">
                      {feature.num}
                    </span>
                    {/* Gradient accent bar */}
                    <div className="absolute left-0 top-0 h-1 w-full bg-[linear-gradient(90deg,var(--primary)_0%,var(--accent)_100%)]" />

                    <CardHeader className="relative px-7 pb-0">
                      <CardTitle className="text-2xl tracking-[-0.03em] text-foreground">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative px-7">
                      <CardDescription className="text-base leading-7 text-muted-foreground">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ PLATFORM PREVIEW ═══════════════════ */}
        <section className="relative bg-foreground px-6 py-16 text-primary-foreground md:px-10 md:py-24">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.35em] text-primary-foreground/60">
                  What your customers see
                </p>
                <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight tracking-[-0.03em] md:text-5xl">
                  A polished storefront, powered by your data.
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="relative mx-auto mt-12 max-w-4xl">
                {/* Browser chrome */}
                <div className="rounded-t-2xl border border-primary-foreground/10 bg-primary-foreground/5 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-primary-foreground/15" />
                    <div className="size-3 rounded-full bg-primary-foreground/15" />
                    <div className="size-3 rounded-full bg-primary-foreground/15" />
                    <div className="ml-4 flex-1 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs text-primary-foreground/50">
                      yourbrand.plotkeys.app
                    </div>
                  </div>
                </div>

                {/* Browser body */}
                <div className="relative rounded-b-2xl border border-t-0 border-primary-foreground/10 bg-background/5 p-6 md:p-10">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <div className="h-6 w-24 rounded bg-primary-foreground/10" />
                      <div className="mt-4 space-y-2">
                        <div className="h-8 w-full rounded bg-primary-foreground/8" />
                        <div className="h-8 w-3/4 rounded bg-primary-foreground/8" />
                      </div>
                      <div className="mt-6 space-y-2">
                        <div className="h-4 w-full rounded bg-primary-foreground/5" />
                        <div className="h-4 w-5/6 rounded bg-primary-foreground/5" />
                        <div className="h-4 w-2/3 rounded bg-primary-foreground/5" />
                      </div>
                      <div className="mt-6 flex gap-3">
                        <div className="h-10 w-28 rounded-lg bg-primary/40" />
                        <div className="h-10 w-28 rounded-lg bg-primary-foreground/10" />
                      </div>
                    </div>
                    <div className="rounded-xl bg-primary-foreground/8 p-4">
                      <div className="aspect-[4/3] rounded-lg bg-primary-foreground/5" />
                      <div className="mt-3 flex gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="h-4 w-full rounded bg-primary-foreground/8" />
                          <div className="h-3 w-2/3 rounded bg-primary-foreground/5" />
                        </div>
                        <div className="h-8 w-20 rounded-lg bg-accent/30" />
                      </div>
                    </div>
                  </div>

                  {/* Floating annotation badges */}
                  {browserAnnotations.map((a, i) => (
                    <Badge
                      key={a.label}
                      variant="secondary"
                      className={`animate-fade-in-up absolute ${a.position} hidden text-xs md:inline-flex`}
                      style={{
                        animationDelay: `${0.8 + i * 0.15}s`,
                        animationFillMode: "both",
                      }}
                    >
                      {a.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════ WORKFLOW ═══════════════════ */}
        <section id="workflow" className="px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
                    Simple workflow
                  </p>
                  <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.03em] md:text-5xl">
                    From setup to launch without the usual platform mess.
                  </h2>
                  <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
                    PlotKeys is designed to give small and growing real-estate
                    teams a clear path from internal operations to a public-ready
                    website.
                  </p>
                </div>

                {/* Timeline */}
                <div className="relative flex flex-col gap-6">
                  {/* Vertical connector line */}
                  <div className="absolute bottom-6 left-[18px] top-6 w-px bg-border md:left-[22px]" />

                  {workflow.map((item, i) => (
                    <ScrollReveal key={item.step} delay={i * 0.2}>
                      <div className="relative flex gap-5 md:gap-6">
                        {/* Step circle */}
                        <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-semibold text-primary md:size-11 md:text-sm">
                          {item.step}
                        </div>
                        {/* Content */}
                        <div className="flex-1 rounded-2xl border border-border bg-card/60 px-5 py-5 backdrop-blur-sm">
                          <h3 className="text-lg font-semibold text-foreground md:text-xl">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════ PRICING ═══════════════════ */}
        <section id="pricing" className="px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <SectionHeading
                eyebrow="Pricing"
                title="Choose the operating layer that matches your growth stage."
                description="Start with a clean public presence, then expand into payments, custom domains, and AI-assisted workflows as your company grows."
              />
            </ScrollReveal>

            <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
              {pricingPlans.map((plan, planIdx) => {
                const pricing = getPlanPricing(plan.tier);
                const isPro = plan.tier === "pro";
                const tierLabel = tierLabels[plan.tier];

                return (
                  <ScrollReveal key={plan.tier} delay={planIdx * 0.15}>
                    <Card
                      className={
                        isPro
                          ? "relative gap-4 overflow-hidden rounded-[1.75rem] border-transparent bg-[linear-gradient(145deg,color-mix(in_srgb,var(--foreground)_96%,black)_0%,var(--primary)_100%)] py-8 text-primary-foreground shadow-[var(--shadow-soft)] lg:scale-[1.03]"
                          : "gap-4 rounded-[1.75rem] border-border bg-card py-8 shadow-[var(--shadow-card)]"
                      }
                    >
                      {isPro && (
                        <div className="animate-gradient-shift absolute inset-0 -z-10 rounded-[1.75rem] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--foreground)_96%,black)_0%,var(--primary)_50%,var(--accent)_100%)] opacity-30" />
                      )}

                      <CardHeader className="px-7 pb-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p
                              className={
                                isPro
                                  ? "text-sm uppercase tracking-[0.32em] text-primary-foreground/70"
                                  : "text-sm uppercase tracking-[0.32em] text-muted-foreground"
                              }
                            >
                              {plan.subtitle}
                            </p>
                            <CardTitle
                              className={
                                isPro
                                  ? "mt-4 text-3xl tracking-[-0.03em] text-primary-foreground"
                                  : "mt-4 text-3xl tracking-[-0.03em] text-foreground"
                              }
                            >
                              {tierLabel}
                            </CardTitle>
                          </div>
                          <Badge variant={isPro ? "secondary" : "outline"}>
                            {isPro ? "Most complete" : "Monthly"}
                          </Badge>
                        </div>

                        <div className="mt-6">
                          <span
                            className={
                              isPro
                                ? "font-serif text-5xl tracking-[-0.04em] text-primary-foreground"
                                : "font-serif text-5xl tracking-[-0.04em] text-foreground"
                            }
                          >
                            {pricing.monthly.formatted}
                          </span>
                          <p
                            className={
                              isPro
                                ? "mt-2 text-sm uppercase tracking-[0.24em] text-primary-foreground/70"
                                : "mt-2 text-sm uppercase tracking-[0.24em] text-muted-foreground"
                            }
                          >
                            {`${planTrialDays}-day free trial · ${pricing.annual.formatted} billed annually · save ${pricing.annualDiscountPercent}%`}
                          </p>
                        </div>
                      </CardHeader>

                      <CardContent className="px-7">
                        <CardDescription
                          className={
                            isPro
                              ? "text-base leading-7 text-primary-foreground/75"
                              : "text-base leading-7 text-muted-foreground"
                          }
                        >
                          {plan.description}
                        </CardDescription>

                        <ul className="mt-6 grid gap-3">
                          {plan.features.map((feature) => (
                            <li
                              key={feature}
                              className={
                                isPro
                                  ? "flex items-start gap-3 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 px-4 py-3 text-sm text-primary-foreground"
                                  : "flex items-start gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground"
                              }
                            >
                              <Check
                                className={
                                  isPro
                                    ? "mt-0.5 size-4 shrink-0 text-accent"
                                    : "mt-0.5 size-4 shrink-0 text-primary"
                                }
                              />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-6">
                          <Button
                            asChild
                            className="w-full transition-all duration-300 hover:scale-[1.02]"
                            variant="default"
                          >
                            <Link href={createWorkspaceHref}>
                              {`Start ${planTrialDays}-day trial`}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════ CTA ═══════════════════ */}
        <section
          id="launch"
          className="relative px-6 py-20 md:px-10 md:py-32"
        >
          <AnimatedOrbs variant="subtle" />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                Ready to launch
              </p>
              <h2 className="mt-6 bg-[linear-gradient(135deg,var(--primary)_0%,var(--accent)_100%)] bg-clip-text font-serif text-5xl leading-tight tracking-[-0.04em] text-transparent md:text-6xl">
                Your website should feel as premium as the properties you market.
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
                Use PlotKeys to centralize operations now, then expand into
                branded websites, custom domains, AI assistance, and deeper
                automation as your team grows.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  className="px-8 py-4 text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  <Link href={createWorkspaceHref}>Create workspace</Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="px-8 py-4 text-base transition-all duration-300 hover:scale-[1.02]"
                >
                  <Link href="/contact">Talk to sales</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════ FOOTER ═══════════════════ */}
        <footer className="border-t border-border px-6 py-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/60">
            &copy; {new Date().getFullYear()} PlotKeys. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  );
}
