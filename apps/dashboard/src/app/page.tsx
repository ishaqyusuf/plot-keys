import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card } from "@plotkeys/ui/card";
import { SectionHeading } from "@plotkeys/ui/section-heading";

const launchSteps = [
  {
    title: "Confirm shared product language",
    detail:
      "Keep extending the token system in packages/ui and avoid app-local one-off styling as dashboard and websites evolve.",
    status: "Started",
  },
  {
    title: "Wire tenant onboarding",
    detail:
      "Replace this static checklist with a real company setup flow covering brand info, market, team invites, and first website preferences.",
    status: "Next",
  },
  {
    title: "Connect live listings",
    detail:
      "Feed the first tenant template from the property model instead of sample data so public pages always reflect actual inventory.",
    status: "Upcoming",
  },
];

const milestoneCards = [
  {
    label: "Foundation",
    value: "Ready",
    detail: "Monorepo, DB, UI package, and app shells are in place.",
  },
  {
    label: "Website MVP",
    value: "Started",
    detail: "First structured tenant template and section library now exist.",
  },
  {
    label: "Ops MVP",
    value: "Next",
    detail: "Company setup, properties, leads, and appointments need wiring.",
  },
];

export default function DashboardHomePage() {
  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="bg-white/88">
            <div className="p-8 md:p-10">
              <Badge variant="primary">Dashboard MVP workspace</Badge>
              <h1 className="mt-5 max-w-3xl font-serif text-5xl text-slate-950 md:text-6xl">
                Start with one company, one website, and one clean operating
                flow.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                This dashboard now acts like the first onboarding surface for
                the MVP: align brand setup, website launch, and operational
                modules in one place before we wire the real data layer.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button>Set up first company</Button>
                <Button variant="secondary">Review website template</Button>
              </div>
            </div>
          </Card>

          <Card className="bg-[linear-gradient(145deg,#102033_0%,#0f766e_100%)] text-white">
            <div className="p-8 md:p-10">
              <p className="text-sm uppercase tracking-[0.32em] text-teal-100">
                MVP status
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
                eyebrow="What we should build next"
                title="A practical launch sequence for the MVP."
                description="These are the next three implementation lanes to carry this repo from scaffold into a usable first tenant workflow."
              />

              <div className="mt-8 grid gap-4">
                {launchSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-[calc(var(--radius-md)-0.15rem)] border border-[color:var(--border)] bg-slate-50/80 px-5 py-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--surface-inverse)] text-sm font-semibold text-white">
                          0{index + 1}
                        </div>
                        <h2 className="font-serif text-2xl text-slate-950">
                          {step.title}
                        </h2>
                      </div>
                      <Badge
                        variant={
                          step.status === "Started"
                            ? "success"
                            : step.status === "Next"
                              ? "accent"
                              : "neutral"
                        }
                      >
                        {step.status}
                      </Badge>
                    </div>
                    <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                      {step.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="bg-[#fff7ed]">
            <div className="p-8">
              <p className="text-sm uppercase tracking-[0.32em] text-amber-700">
                Initial onboarding contents
              </p>
              <ul className="mt-6 grid gap-3">
                {[
                  "Company name, market, and contact line",
                  "Primary brand colors, logo, and public positioning",
                  "Starter team members and role invitations",
                  "Default property publishing preferences",
                  "First template selection and launch checklist",
                ].map((item) => (
                  <li
                    key={item}
                    className="rounded-[calc(var(--radius-md)-0.15rem)] border border-amber-200 bg-white/70 px-4 py-4 text-base text-slate-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-7 text-slate-600">
                This list is still static, but it gives us a concrete contract
                for the real onboarding flow we should wire next.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
