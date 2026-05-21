"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { Icon } from "@plotkeys/ui/icons";
import { PlotKeysLogo } from "@plotkeys/ui/plotkeys-logo";
import Link from "next/link";

import { EarlyAccessForm } from "../early-access-form";

type EarlyAccessPageProps = {
  showLandingPreviewLink?: boolean;
};

const audienceChips = ["Agencies", "Developers", "Estate sellers", "Builders"];

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

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:px-8">
        <div className="flex max-w-4xl flex-col gap-8">
          <div className="flex flex-col gap-6">
            <Badge className="w-fit" variant="outline">
              Private early access
            </Badge>
            <div className="flex flex-col gap-5">
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-balance sm:text-5xl lg:text-6xl">
                Private access for real-estate teams building modern property
                operations.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Launch branded property sites, manage listings, capture leads,
                and prepare customer workflows from one operating workspace.
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

          <div className="flex flex-wrap gap-2">
            {audienceChips.map((chip) => (
              <Badge key={chip} variant="secondary">
                {chip}
              </Badge>
            ))}
          </div>

          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Best for companies with active inventory, a sales team, or customer
            workflows that have outgrown scattered tools.
          </p>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
          <div id="request-access">
            <EarlyAccessForm />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Selective rollout</CardTitle>
              <CardDescription>
                We are onboarding teams manually while the workspace is still
                in private access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                <Icon.CheckCircle className="mt-0.5 size-5 shrink-0 text-primary" />
                <p>
                  Share a work email and we will follow up with setup details
                  if your team is a fit.
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}
