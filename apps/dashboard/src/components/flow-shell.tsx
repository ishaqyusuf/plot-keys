import { Badge } from "@plotkeys/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import Link from "next/link";
import type { ReactNode } from "react";

type FlowShellProps = {
  badge: string;
  children: ReactNode;
  description: string;
  eyebrow?: string;
  sidePanel: ReactNode;
  title: string;
};

export function FlowShell({
  badge,
  children,
  description,
  eyebrow = "Tenant setup",
  sidePanel,
  title,
}: FlowShellProps) {
  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <Link
          aria-label="Go to homepage"
          className="mb-6 inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition hover:border-primary hover:text-primary"
          href="/"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary)_0%,color-mix(in_srgb,var(--primary)_70%,white)_100%)] text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground">
            PK
          </span>
          <span className="font-medium tracking-[0.18em] uppercase">
            PlotKeys
          </span>
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="bg-card">
          <CardHeader className="px-8 pt-8 md:px-10 md:pt-10">
            <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">
              {eyebrow}
            </p>
            <Badge className="mt-5" variant="default">
              {badge}
            </Badge>
            <CardTitle className="mt-5 max-w-3xl font-serif text-5xl text-foreground md:text-6xl">
              {title}
            </CardTitle>
            <CardDescription className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8 md:px-10 md:pb-10">
            {children}
          </CardContent>
        </Card>

        <Card className="border-transparent bg-[linear-gradient(145deg,color-mix(in_srgb,var(--foreground)_94%,black)_0%,var(--primary)_100%)] text-primary-foreground">
          <CardContent className="px-8 py-8 md:px-10 md:py-10">
            {sidePanel}
          </CardContent>
        </Card>
        </div>
      </div>
    </main>
  );
}
