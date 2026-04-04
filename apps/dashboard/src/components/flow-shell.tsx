import { Badge } from "@plotkeys/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { Separator } from "@plotkeys/ui/separator";
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
    <main className="min-h-screen bg-background px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <Link
          aria-label="Go to homepage"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
          href="/"
        >
          <div className="flex size-7 items-center justify-center rounded-md bg-foreground text-background text-xs font-semibold">
            PK
          </div>
          PlotKeys
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <Card className="border-border">
            <CardHeader className="px-8 pt-8 md:px-10 md:pt-10">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {eyebrow}
              </p>
              <Badge className="mt-4 w-fit" variant="secondary">
                {badge}
              </Badge>
              <CardTitle className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {title}
              </CardTitle>
              <CardDescription className="mt-3 text-base leading-7">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 md:px-10 md:pb-10">
              {children}
            </CardContent>
          </Card>

          <div className="rounded-xl border border-border bg-muted/40 p-8 md:p-10">
            {sidePanel}
          </div>
        </div>
      </div>
    </main>
  );
}
