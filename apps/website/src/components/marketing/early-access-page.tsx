"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { PlotKeysLogo } from "@plotkeys/ui/plotkeys-logo";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { EarlyAccessForm } from "../early-access-form";
import { NewsletterForm } from "../newsletter-form";

type EarlyAccessPageProps = {
  showLandingPreviewLink?: boolean;
};

const accessNotes = [
  "Template-led website launch",
  "Estate, plot, and listing operations",
  "Lead capture with team handoff",
];

export function EarlyAccessPage({
  showLandingPreviewLink = false,
}: EarlyAccessPageProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f4ee] text-[#121b24]">
      <section className="relative isolate flex min-h-screen items-center px-5 py-8 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,#f7f4ee_0%,#f2eadf_42%,#dce8e4_100%)]" />
        <div className="absolute inset-x-0 top-0 -z-10 h-24 border-b border-[#121b24]/10 bg-white/35 backdrop-blur-xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-1/2 w-full bg-[linear-gradient(0deg,rgba(18,27,36,0.08),transparent)]" />

        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <header className="mb-14 flex items-center justify-between gap-5">
              <PlotKeysLogo
                className="text-[#0f6b61]"
                markClassName="h-10"
                wordmarkClassName="text-sm tracking-[0.32em]"
              />
              {showLandingPreviewLink ? (
                <Button
                  asChild
                  variant="secondary"
                  className="hidden rounded-full border border-[#121b24]/10 bg-white/60 px-5 text-sm shadow-none backdrop-blur sm:inline-flex"
                >
                  <Link href="/landing">
                    View landing
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              ) : null}
            </header>

            <Badge className="rounded-full bg-[#121b24] px-4 py-2 text-xs uppercase tracking-[0.24em] text-white">
              Early access
            </Badge>

            <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-normal text-[#121b24] sm:text-6xl lg:text-7xl">
              PlotKeys is opening to selected real-estate teams.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#445260]">
              Run listings, estates, plots, leads, and branded site launches
              from one operating layer built for serious property companies.
            </p>

            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {accessNotes.map((note) => (
                <div
                  className="border-l border-[#0f6b61]/40 bg-white/45 px-4 py-3 text-sm font-medium text-[#24313d] backdrop-blur"
                  key={note}
                >
                  {note}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-8 hidden h-[84%] w-3 border-y border-l border-[#121b24]/15 lg:block" />
            <div className="border border-[#121b24]/12 bg-[#121b24] p-3 shadow-[0_30px_80px_rgba(18,27,36,0.22)]">
              <div className="bg-[#fdfbf7] p-5 sm:p-7">
                <div className="mb-6 flex items-center justify-between border-b border-[#121b24]/10 pb-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#6a7682]">
                      Private rollout
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-normal">
                      Request access
                    </p>
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-full bg-[#0f6b61] text-white">
                    <CheckCircle2 className="size-5" />
                  </div>
                </div>

                <EarlyAccessForm className="rounded-none border-[#121b24]/10 bg-white p-5 shadow-none" />

                <div className="mt-5 border border-[#121b24]/10 bg-[#f5efe5] p-5">
                  <p className="text-sm font-semibold text-[#121b24]">
                    Want launch notes instead?
                  </p>
                  <div className="mt-4">
                    <NewsletterForm />
                  </div>
                </div>

                {showLandingPreviewLink ? (
                  <Button
                    asChild
                    variant="ghost"
                    className="mt-5 w-full rounded-none border border-[#121b24]/10"
                  >
                    <Link href="/landing">Preview the full landing page</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
