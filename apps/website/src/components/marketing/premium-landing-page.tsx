import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { PlotKeysLogo } from "@plotkeys/ui/plotkeys-logo";
import {
  ArrowRight,
  Building2,
  Check,
  ClipboardList,
  Globe2,
  LayoutTemplate,
  MapIcon,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

import { AnimatedCounter } from "../animated-counter";
import { EarlyAccessForm } from "../early-access-form";
import { ScrollReveal } from "../scroll-reveal";

type PremiumLandingPageProps = {
  createWorkspaceHref: string;
  showEarlyAccessCta?: boolean;
};

const operatingLayers = [
  {
    description:
      "Keep inventory, media, status, and publishing details in sync.",
    icon: Building2,
    title: "Listings and estates",
  },
  {
    description:
      "Track holds, allocation intent, documents, and customer movement.",
    icon: MapIcon,
    title: "Plot operations",
  },
  {
    description:
      "Capture interest and hand work to the right people without delay.",
    icon: Users,
    title: "Leads and teams",
  },
  {
    description: "Choose a template. Launch your site.",
    icon: LayoutTemplate,
    title: "Branded templates",
  },
];

const dashboardStats = [
  { label: "Active estates", value: "12" },
  { label: "Open reservations", value: "48" },
  { label: "Lead response", value: "7m" },
];

const plotCells = Array.from({ length: 24 }, (_, index) => ({
  id: `plot-cell-${index + 1}`,
  tone: index % 5 === 0 ? "primary" : index % 3 === 0 ? "accent" : "available",
}));

const timeline = [
  "Company workspace configured",
  "Template selected and copy edited",
  "Listings synced to public pages",
  "Leads routed to sales team",
];

const audiences = [
  {
    copy: "Launch inventory, manage interest, and see the commercial pipeline without spreadsheet drift.",
    title: "Estate developers",
  },
  {
    copy: "Give every listing a cleaner path from public discovery to assigned-agent follow-up.",
    title: "Agencies and brokers",
  },
  {
    copy: "Keep admins, sales reps, and leadership aligned around the same operational record.",
    title: "Sales operations",
  },
];

export function PremiumLandingPage({
  createWorkspaceHref,
  showEarlyAccessCta = false,
}: PremiumLandingPageProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5ef] text-[#121b24]">
      <section className="relative isolate border-b border-[#121b24]/10 px-5 py-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#f8f5ef_0%,#ecf1ed_44%,#d9e3de_100%)]" />
        <div className="mx-auto max-w-7xl">
          <header className="flex flex-wrap items-center justify-between gap-5">
            <PlotKeysLogo
              className="text-[#0f6b61]"
              markClassName="h-10"
              wordmarkClassName="text-sm tracking-[0.32em]"
            />
            <nav className="flex items-center gap-2 text-sm text-[#465360] sm:gap-4">
              <a className="px-2 py-2 hover:text-[#121b24]" href="#platform">
                Platform
              </a>
              <a className="px-2 py-2 hover:text-[#121b24]" href="#templates">
                Templates
              </a>
              <a className="px-2 py-2 hover:text-[#121b24]" href="#access">
                Access
              </a>
              <Button asChild className="rounded-full px-5">
                <Link href={createWorkspaceHref}>Launch your website</Link>
              </Button>
            </nav>
          </header>

          <div className="grid gap-12 pb-14 pt-16 lg:grid-cols-[1fr_0.95fr] lg:items-end lg:pb-20 lg:pt-24">
            <div>
              <Badge className="rounded-full bg-[#121b24] px-4 py-2 text-xs uppercase tracking-[0.24em] text-white">
                Real-estate operating system
              </Badge>
              <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.95] tracking-normal text-[#121b24] sm:text-6xl lg:text-7xl">
                The operating layer behind serious property companies.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#445260]">
                PlotKeys connects listings, estates, plots, customer interest,
                team follow-up, and branded website templates in one calm
                system.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="rounded-full px-7 py-6 text-base">
                  <Link href={createWorkspaceHref}>
                    Launch your company website
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                {showEarlyAccessCta ? (
                  <Button
                    asChild
                    variant="secondary"
                    className="rounded-full border border-[#121b24]/10 bg-white/70 px-7 py-6 text-base"
                  >
                    <Link href="/early-access">View early access</Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="secondary"
                    className="rounded-full border border-[#121b24]/10 bg-white/70 px-7 py-6 text-base"
                  >
                    <a href="#platform">Explore platform</a>
                  </Button>
                )}
              </div>
            </div>

            <ProductCommandScene />
          </div>
        </div>
      </section>

      <section className="border-b border-[#121b24]/10 bg-[#121b24] px-5 py-8 text-white sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-3">
          <Metric label="Template-led launch" suffix=" site" target={1} />
          <Metric label="Core tools unified" suffix="-in-1" target={5} />
          <Metric label="Tenant-ready workflow" suffix="%" target={100} />
        </div>
      </section>

      <section id="platform" className="px-5 py-18 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.28em] text-[#0f6b61]">
                One operating record
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                Stop running public presence and operations as separate worlds.
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-px overflow-hidden border border-[#121b24]/10 bg-[#121b24]/10 md:grid-cols-2 lg:grid-cols-4">
            {operatingLayers.map((layer, index) => {
              const Icon = layer.icon;
              return (
                <ScrollReveal delay={index * 0.08} key={layer.title}>
                  <article className="min-h-64 bg-[#fffdf8] p-6">
                    <div className="flex size-11 items-center justify-center rounded-full bg-[#0f6b61]/10 text-[#0f6b61]">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-8 text-2xl font-semibold tracking-normal">
                      {layer.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[#52606d]">
                      {layer.description}
                    </p>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="templates"
        className="border-y border-[#121b24]/10 bg-[#eaf0ec] px-5 py-18 sm:px-8 lg:px-12 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <ScrollReveal>
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#0f6b61]">
                Branded site templates
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                Choose a template. Launch your site.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#445260]">
                Teams select from curated real-estate templates, edit the copy
                that matters, and publish a polished public presence connected
                to their operational data.
              </p>
              <ul className="mt-8 grid gap-3 text-sm text-[#26323e]">
                {timeline.map((item) => (
                  <li className="flex items-center gap-3" key={item}>
                    <Check className="size-4 text-[#0f6b61]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <TemplatePickerScene />
          </ScrollReveal>
        </div>
      </section>

      <section className="px-5 py-18 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <ScrollReveal>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[#0f6b61]">
                  Built for the people doing the work
                </p>
                <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                  A premium front door with an operational backbone.
                </h2>
              </div>
            </ScrollReveal>
            <div className="grid gap-4 md:grid-cols-3">
              {audiences.map((audience, index) => (
                <ScrollReveal delay={index * 0.1} key={audience.title}>
                  <article className="h-full border border-[#121b24]/10 bg-white p-6">
                    <h3 className="text-xl font-semibold tracking-normal">
                      {audience.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[#52606d]">
                      {audience.copy}
                    </p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="access"
        className="border-t border-[#121b24]/10 bg-[#121b24] px-5 py-18 text-white sm:px-8 lg:px-12 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_0.75fr] lg:items-start">
          <ScrollReveal>
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/55">
                Launch with focus
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                Give your property business a system that feels as considered as
                the assets you sell.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/68">
                Start with your company website, organize the real estate
                operation behind it, then publish from a template when the
                public presence is ready.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="rounded-full bg-white px-7 py-6 text-base text-[#121b24] hover:bg-white/90"
                >
                  <Link href={createWorkspaceHref}>
                    Launch your company website
                  </Link>
                </Button>
                {showEarlyAccessCta ? (
                  <Button
                    asChild
                    variant="secondary"
                    className="rounded-full border border-white/15 bg-white/10 px-7 py-6 text-base text-white hover:bg-white/15"
                  >
                    <Link href="/early-access">Open early access page</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </ScrollReveal>

          {showEarlyAccessCta ? (
            <ScrollReveal delay={0.15}>
              <EarlyAccessForm className="rounded-none border-white/10 bg-white/[0.06] text-white backdrop-blur-none [&_input]:bg-white [&_p]:text-white/72" />
            </ScrollReveal>
          ) : (
            <ScrollReveal delay={0.15}>
              <div className="border border-white/12 bg-white/[0.06] p-6">
                <Sparkles className="size-6 text-[#c39a56]" />
                <p className="mt-8 text-2xl font-semibold tracking-normal">
                  Ready for serious teams.
                </p>
                <p className="mt-4 text-sm leading-7 text-white/68">
                  Template-led site launch, operational CRM, plot workflows, and
                  AI-assisted content live in the same product surface.
                </p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>
    </main>
  );
}

function Metric({
  label,
  suffix,
  target,
}: {
  label: string;
  suffix: string;
  target: number;
}) {
  return (
    <div className="border-l border-white/14 px-5">
      <p className="text-4xl font-semibold tracking-normal">
        <AnimatedCounter target={target} suffix={suffix} />
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/52">
        {label}
      </p>
    </div>
  );
}

function ProductCommandScene() {
  return (
    <div className="relative border border-[#121b24]/12 bg-white/72 p-3 shadow-[0_30px_80px_rgba(18,27,36,0.16)] backdrop-blur">
      <div className="border border-[#121b24]/10 bg-[#fffdf8]">
        <div className="flex items-center justify-between border-b border-[#121b24]/10 px-4 py-3 text-xs text-[#65717d]">
          <span className="uppercase tracking-[0.22em]">Command center</span>
          <span>Live workspace</span>
        </div>
        <div className="grid gap-px bg-[#121b24]/10 md:grid-cols-[0.72fr_1fr]">
          <div className="bg-[#f7f2e9] p-5">
            <div className="flex items-center gap-3">
              <Globe2 className="size-5 text-[#0f6b61]" />
              <span className="text-sm font-semibold">Oakfield Estates</span>
            </div>
            <div className="mt-6 grid gap-3">
              {dashboardStats.map((stat) => (
                <div
                  className="flex items-center justify-between border border-[#121b24]/10 bg-white px-4 py-3"
                  key={stat.label}
                >
                  <span className="text-xs text-[#65717d]">{stat.label}</span>
                  <span className="text-lg font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#fffdf8] p-5">
            <div className="grid grid-cols-6 gap-2">
              {plotCells.map((cell) => (
                <div
                  className={
                    cell.tone === "primary"
                      ? "h-12 bg-[#0f6b61]"
                      : cell.tone === "accent"
                        ? "h-12 bg-[#c39a56]"
                        : "h-12 bg-[#dfe8e4]"
                  }
                  key={cell.id}
                />
              ))}
            </div>
            <div className="mt-5 border border-[#121b24]/10 bg-[#121b24] p-4 text-white">
              <div className="flex items-center gap-3">
                <ClipboardList className="size-5 text-[#c39a56]" />
                <span className="font-semibold">Reservation queue</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/68">
                9 qualified buyers awaiting plot confirmation and document
                review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplatePickerScene() {
  return (
    <div className="border border-[#121b24]/10 bg-white p-4 shadow-[0_24px_70px_rgba(18,27,36,0.12)]">
      <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-3">
          {["Estate launch", "Brokerage classic", "Premium listings"].map(
            (template, index) => (
              <div
                className={
                  index === 0
                    ? "border border-[#0f6b61] bg-[#ecf4f1] p-4"
                    : "border border-[#121b24]/10 bg-[#f7f4ee] p-4"
                }
                key={template}
              >
                <p className="text-sm font-semibold">{template}</p>
                <p className="mt-2 text-xs leading-5 text-[#65717d]">
                  Structured sections, listing blocks, and editable launch copy.
                </p>
              </div>
            ),
          )}
        </div>
        <div className="border border-[#121b24]/10 bg-[#121b24] p-4 text-white">
          <div className="h-40 bg-[linear-gradient(135deg,#dfe8e4,#f7f1e7)]" />
          <p className="mt-5 text-xs uppercase tracking-[0.24em] text-white/48">
            Public site preview
          </p>
          <h3 className="mt-3 text-3xl font-semibold leading-tight tracking-normal">
            Modern homes at Westbridge Gardens
          </h3>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="h-14 bg-white/12" />
            <div className="h-14 bg-white/12" />
            <div className="h-14 bg-[#c39a56]" />
          </div>
        </div>
      </div>
    </div>
  );
}
