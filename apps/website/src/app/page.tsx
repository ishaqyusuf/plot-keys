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
import Link from "next/link";

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
    price: "NGN 24k",
    subtitle: "Launch essentials",
    tier: "Starter",
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
    price: "NGN 24k",
    subtitle: "Growth-ready workspace",
    tier: "Plus",
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
    price: "NGN 79k",
    subtitle: "Premium operating layer",
    tier: "Pro",
  },
];

export default function MarketingHomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative px-6 py-6 md:px-10 md:py-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--primary)_24%,transparent)_0%,transparent_22%),radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--accent)_20%,transparent)_0%,transparent_18%)]" />
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-border bg-card p-5 shadow-[var(--shadow-soft)] backdrop-blur md:p-8">
          <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-primary">
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
                <Link href="/login">Sign in</Link>
              </Button>
            </nav>
          </header>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="relative">
              <Badge className="px-4 py-2 text-xs uppercase tracking-[0.3em]">
                Built for agencies, developers, and property teams
              </Badge>

              <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-foreground md:text-7xl">
                Run the business.
                <br />
                Launch the website.
                <br />
                Capture every lead.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                PlotKeys unifies listings, CRM, agents, appointments, AI
                content, and branded property websites in one clean workflow.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="px-6 py-3.5">
                  <Link href="/signup">Create workspace</Link>
                </Button>
                <Button asChild variant="secondary" className="px-6 py-3.5">
                  <Link href="#features">Explore platform</Link>
                </Button>
              </div>

              <ul className="mt-8 grid gap-3 text-sm text-foreground">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3"
                  >
                    <span className="mt-1 size-2.5 rounded-full bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="absolute -right-6 top-8 hidden h-28 w-28 rounded-full bg-primary/20 blur-3xl md:block" />
              <div className="absolute -left-4 bottom-8 hidden h-28 w-28 rounded-full bg-accent/20 blur-3xl md:block" />

              <div className="relative rounded-[2rem] bg-foreground p-6 text-background shadow-[var(--shadow-card)] md:p-8">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-primary-foreground/75">
                  <span>Live tenant website</span>
                  <span>company.plotkeys.app</span>
                </div>

                <div className="mt-8 rounded-[1.5rem] bg-background/10 p-5 ring-1 ring-background/10">
                  <p className="text-sm text-primary-foreground/70">Featured property</p>
                  <h2 className="mt-3 font-serif text-3xl leading-tight">
                    Elegant homes, credible brand, smoother lead flow.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-primary-foreground/75">
                    Every listing, testimonial, CTA, and neighborhood story is
                    presented in a structured layout that feels premium on both
                    desktop and mobile.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-2xl border border-background/10 bg-background/10 px-4 py-4"
                      >
                        <p className="text-2xl font-semibold text-background">
                          {metric.value}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-primary-foreground/60">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between rounded-[1.5rem] border border-background/10 bg-background/10 px-5 py-4">
                  <div>
                    <p className="text-sm text-primary-foreground/70">
                      Lead capture status
                    </p>
                    <p className="mt-1 text-lg font-medium">
                      Routing to assigned agent
                    </p>
                  </div>
                  <div className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-primary-foreground">
                    Live
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-8 md:px-10 md:py-12">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Why teams choose PlotKeys"
            title="A cleaner system for operations and public presence."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="gap-4 rounded-[1.75rem] border-border bg-card py-7 shadow-[var(--shadow-card)]"
              >
                <CardHeader className="px-6 pb-0">
                  <div className="size-12 rounded-2xl bg-[linear-gradient(135deg,var(--primary)_0%,color-mix(in_srgb,var(--primary)_70%,white)_100%)]" />
                  <CardTitle className="mt-5 text-2xl tracking-[-0.03em] text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6">
                  <CardDescription className="text-base leading-7 text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="px-6 py-8 md:px-10 md:py-12">
        <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--foreground)_96%,black)_0%,var(--primary)_100%)] px-6 py-8 text-primary-foreground shadow-[var(--shadow-soft)] md:px-8 md:py-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-primary-foreground/80">
              Simple workflow
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.03em]">
              From setup to launch without the usual platform mess.
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-primary-foreground/75">
              PlotKeys is designed to give small and growing real-estate teams a
              clear path from internal operations to a public-ready website.
            </p>
          </div>

          <div className="grid gap-4">
            {workflow.map((item) => (
              <div
                key={item.step}
                className="rounded-[1.5rem] border border-primary-foreground/10 bg-primary-foreground/10 px-5 py-5"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-3 py-1 text-xs font-medium tracking-[0.3em] text-primary-foreground/85">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-foreground/75">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-6 py-8 md:px-10 md:py-12">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Pricing"
            title="Choose the operating layer that matches your growth stage."
            description="Start with a clean public presence, then expand into payments, custom domains, and AI-assisted workflows as your company grows."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.tier}
                className={
                  plan.tier === "Pro"
                    ? "gap-4 rounded-[1.75rem] border-transparent bg-[linear-gradient(145deg,color-mix(in_srgb,var(--foreground)_96%,black)_0%,var(--primary)_100%)] py-7 text-primary-foreground shadow-[var(--shadow-soft)]"
                    : "gap-4 rounded-[1.75rem] border-border bg-card py-7 shadow-[var(--shadow-card)]"
                }
              >
                <CardHeader className="px-6 pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p
                        className={
                          plan.tier === "Pro"
                            ? "text-sm uppercase tracking-[0.32em] text-primary-foreground/70"
                            : "text-sm uppercase tracking-[0.32em] text-muted-foreground"
                        }
                      >
                        {plan.subtitle}
                      </p>
                      <CardTitle
                        className={
                          plan.tier === "Pro"
                            ? "mt-4 text-3xl tracking-[-0.03em] text-primary-foreground"
                            : "mt-4 text-3xl tracking-[-0.03em] text-foreground"
                        }
                      >
                        {plan.tier}
                      </CardTitle>
                    </div>
                    <Badge variant={plan.tier === "Pro" ? "secondary" : "outline"}>
                      {plan.tier === "Pro" ? "Most complete" : "Monthly"}
                    </Badge>
                  </div>

                  <div className="mt-6 flex items-end gap-2">
                    <span
                      className={
                        plan.tier === "Pro"
                          ? "font-serif text-5xl tracking-[-0.04em] text-primary-foreground"
                          : "font-serif text-5xl tracking-[-0.04em] text-foreground"
                      }
                    >
                      {plan.price}
                    </span>
                    <span
                      className={
                        plan.tier === "Pro"
                          ? "pb-2 text-sm uppercase tracking-[0.24em] text-primary-foreground/70"
                          : "pb-2 text-sm uppercase tracking-[0.24em] text-muted-foreground"
                      }
                    >
                      / month
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="px-6">
                  <CardDescription
                    className={
                      plan.tier === "Pro"
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
                          plan.tier === "Pro"
                            ? "flex items-start gap-3 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 px-4 py-3 text-sm text-primary-foreground"
                            : "flex items-start gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground"
                        }
                      >
                        <span
                          className={
                            plan.tier === "Pro"
                              ? "mt-1 size-2.5 rounded-full bg-accent"
                              : "mt-1 size-2.5 rounded-full bg-primary"
                          }
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <Button
                      asChild
                      className="w-full"
                      variant="default"
                    >
                      <Link href="/signup">
                        {`Choose ${plan.tier}`}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="launch"
        className="px-6 py-8 pb-12 md:px-10 md:py-12 md:pb-16"
      >
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-[2rem] border-border bg-accent/10 py-7 shadow-none">
            <CardHeader className="px-6 pb-0">
              <CardTitle className="text-sm uppercase tracking-[0.35em] text-accent-foreground">
                Built for trust
              </CardTitle>
              <CardTitle className="mt-4 font-serif text-4xl tracking-[-0.03em] text-foreground">
                Your website should feel as premium as the properties you market.
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6">
              <CardDescription className="text-base leading-7 text-muted-foreground">
                PlotKeys pairs a disciplined multi-tenant foundation with polished
                website presentation, so every company gets a credible digital
                storefront without rebuilding from scratch.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-border bg-card py-7 shadow-[var(--shadow-card)]">
            <CardHeader className="px-6 pb-0">
              <CardTitle className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
                Ready to launch
              </CardTitle>
              <CardTitle className="mt-4 text-3xl tracking-[-0.03em] text-foreground">
                Start with a clean foundation and scale from there.
              </CardTitle>
              <CardDescription className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
                Use PlotKeys to centralize operations now, then expand into
                branded websites, custom domains, AI assistance, and deeper
                automation as your team grows.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="px-6 py-3.5">
                  <Link href="/signup">Create workspace</Link>
                </Button>
                <Button asChild variant="secondary" className="px-6 py-3.5">
                  <Link href="/contact">Talk to sales</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
