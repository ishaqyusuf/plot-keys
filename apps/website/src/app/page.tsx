import { Button } from "@plotkeys/ui/button";
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

export default function MarketingHomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#99f6e4_0%,rgba(153,246,228,0)_22%),radial-gradient(circle_at_top_right,#fcd34d_0%,rgba(252,211,77,0)_18%),linear-gradient(180deg,#f4efe7_0%,#fcfbf7_42%,#f8fafc_100%)] text-slate-950">
      <section className="relative px-6 py-6 md:px-10 md:py-8">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
          <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-teal-700">
                PlotKeys
              </p>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                The operating system for modern real-estate companies.
              </p>
            </div>

            <nav className="flex flex-wrap items-center gap-5 text-sm text-slate-600">
              <a href="#features" className="transition hover:text-slate-950">
                Features
              </a>
              <a href="#workflow" className="transition hover:text-slate-950">
                Workflow
              </a>
              <a href="#launch" className="transition hover:text-slate-950">
                Launch
              </a>
              <Button asChild variant="secondary">
                <Link href="/login">Sign in</Link>
              </Button>
            </nav>
          </header>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="relative">
              <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-teal-800">
                Built for agencies, developers, and property teams
              </div>

              <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-slate-950 md:text-7xl">
                Run the business.
                <br />
                Launch the website.
                <br />
                Capture every lead.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                PlotKeys unifies listings, CRM, agents, appointments, AI
                content, and branded property websites in one clean workflow.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="px-6 py-3.5">
                  <Link href="/signup">Start free</Link>
                </Button>
                <Button asChild variant="secondary" className="px-6 py-3.5">
                  <Link href="#features">Explore platform</Link>
                </Button>
              </div>

              <ul className="mt-8 grid gap-3 text-sm text-slate-700">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3"
                  >
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="absolute -right-6 top-8 hidden h-28 w-28 rounded-full bg-teal-200/70 blur-3xl md:block" />
              <div className="absolute -left-4 bottom-8 hidden h-28 w-28 rounded-full bg-amber-200/70 blur-3xl md:block" />

              <div className="relative rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.24)] md:p-8">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-teal-200">
                  <span>Live tenant website</span>
                  <span>company.plotkeys.app</span>
                </div>

                <div className="mt-8 rounded-[1.5rem] bg-white/8 p-5 ring-1 ring-white/10">
                  <p className="text-sm text-slate-300">Featured property</p>
                  <h2 className="mt-3 font-serif text-3xl leading-tight">
                    Elegant homes, credible brand, smoother lead flow.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    Every listing, testimonial, CTA, and neighborhood story is
                    presented in a structured layout that feels premium on both
                    desktop and mobile.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4"
                      >
                        <p className="text-2xl font-semibold text-white">
                          {metric.value}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-400">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/6 px-5 py-4">
                  <div>
                    <p className="text-sm text-slate-300">Lead capture status</p>
                    <p className="mt-1 text-lg font-medium">Routing to assigned agent</p>
                  </div>
                  <div className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-emerald-300">
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
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
              Why teams choose PlotKeys
            </p>
            <h2 className="mt-3 font-serif text-4xl tracking-[-0.03em] text-slate-950 md:text-5xl">
              A cleaner system for operations and public presence.
            </h2>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[1.75rem] border border-slate-200 bg-white px-6 py-7 shadow-[0_18px_40px_rgba(15,23,42,0.05)]"
              >
                <div className="h-12 w-12 rounded-2xl bg-[linear-gradient(135deg,#0f766e_0%,#14b8a6_100%)]" />
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="px-6 py-8 md:px-10 md:py-12">
        <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] bg-[linear-gradient(145deg,#0f172a_0%,#134e4a_100%)] px-6 py-8 text-white shadow-[0_22px_60px_rgba(15,23,42,0.18)] md:px-8 md:py-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-teal-200">
              Simple workflow
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.03em]">
              From setup to launch without the usual platform mess.
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
              PlotKeys is designed to give small and growing real-estate teams a
              clear path from internal operations to a public-ready website.
            </p>
          </div>

          <div className="grid gap-4">
            {workflow.map((item) => (
              <div
                key={item.step}
                className="rounded-[1.5rem] border border-white/10 bg-white/7 px-5 py-5"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full border border-teal-200/30 bg-teal-300/10 px-3 py-1 text-xs font-medium tracking-[0.3em] text-teal-100">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="launch" className="px-6 py-8 pb-12 md:px-10 md:py-12 md:pb-16">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-[#fff7ed] px-6 py-7">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-700">
              Built for trust
            </p>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] text-slate-950">
              Your website should feel as premium as the properties you market.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-700">
              PlotKeys pairs a disciplined multi-tenant foundation with
              polished website presentation, so every company gets a credible
              digital storefront without rebuilding from scratch.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-7 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
              Ready to launch
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
              Start with a clean foundation and scale from there.
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
              Use PlotKeys to centralize operations now, then expand into
              branded websites, custom domains, AI assistance, and deeper
              automation as your team grows.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="px-6 py-3.5">
                <Link href="/signup">Create workspace</Link>
              </Button>
              <Button asChild variant="secondary" className="px-6 py-3.5">
                <Link href="/contact">Talk to sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
