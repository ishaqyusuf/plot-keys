"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { Icon } from "@plotkeys/ui/icons";
import { PlotKeysLogo } from "@plotkeys/ui/plotkeys-logo";
import { Separator } from "@plotkeys/ui/separator";
import Link from "next/link";

import { EarlyAccessForm } from "../early-access-form";
import { NewsletterForm } from "../newsletter-form";

type EarlyAccessPageProps = {
  showLandingPreviewLink?: boolean;
};

const operatorSignals = [
  {
    label: "Launch pipeline",
    value: "12 sites",
    detail: "Template-led workspaces moving from draft to live.",
  },
  {
    label: "Estate inventory",
    value: "840 plots",
    detail: "Allocation, reservation, and customer-facing visibility.",
  },
  {
    label: "Lead operations",
    value: "3.8x",
    detail: "Faster handoff from public inquiry to team action.",
  },
];

const platformModules = [
  "Branded property websites",
  "Listings, estates, and plot allocation",
  "Customer portal and offer tracking",
  "Construction project visibility",
];

export function EarlyAccessPage({
  showLandingPreviewLink = false,
}: EarlyAccessPageProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/95">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <PlotKeysLogo
            className="text-primary"
            markClassName="h-9"
            wordmarkClassName="text-sm"
          />
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Private beta</Badge>
            {showLandingPreviewLink ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/landing">
                  View landing
                  <Icon.ExternalLink data-icon="inline-end" />
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.72fr)] lg:px-8 lg:py-16">
        <div className="flex flex-col gap-8">
          <div className="flex max-w-4xl flex-col gap-6">
            <Badge className="w-fit" variant="outline">
              Early access for serious property operators
            </Badge>
            <div className="flex flex-col gap-5">
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-balance sm:text-5xl lg:text-6xl">
                The operating system for real-estate companies scaling beyond
                spreadsheets.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                PlotKeys brings branded websites, listings, estates, customer
                portals, leads, and construction workflows into one controlled
                workspace for teams that intend to grow.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="#request-access">
                  Request access
                  <Icon.ArrowRight data-icon="inline-end" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {operatorSignals.map((signal) => (
              <Card key={signal.label}>
                <CardHeader>
                  <CardDescription>{signal.label}</CardDescription>
                  <CardTitle className="text-2xl">{signal.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {signal.detail}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What early access unlocks</CardTitle>
              <CardDescription>
                A focused rollout for teams that need operational leverage, not
                another generic website builder.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {platformModules.map((module) => (
                  <div className="flex items-start gap-3" key={module}>
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border bg-muted">
                      <Icon.Check data-icon="inline-start" />
                    </div>
                    <p className="text-sm font-medium leading-6">{module}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
          <div id="request-access">
            <EarlyAccessForm />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Built for the first 100 category leaders</CardTitle>
              <CardDescription>
                We are onboarding a small group of high-intent teams before the
                broader public launch.
              </CardDescription>
              <CardAction>
                <Icon.Award className="size-5 text-primary" />
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Separator />
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Rollout</span>
                  <span className="font-medium">Manual approval</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Best fit</span>
                  <span className="font-medium">Active operators</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Goal</span>
                  <span className="font-medium">$100M company standard</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Launch notes</CardTitle>
              <CardDescription>
                Follow product updates while access is still limited.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NewsletterForm className="border-0 bg-transparent p-0 shadow-none" />
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}
