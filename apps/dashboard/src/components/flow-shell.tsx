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
import { OnboardingBrandAvatar } from "./onboarding/onboarding-brand-avatar";

type FlowShellProps = {
  badge: string;
  brandEditable?: boolean;
  brandLogoUrl?: string | null;
  brandName?: string;
  children: ReactNode;
  description: string;
  eyebrow?: string;
  sidePanel: ReactNode;
  title: string;
};

export function FlowShell({
  badge,
  brandEditable = false,
  brandLogoUrl = null,
  brandName = "PlotKeys",
  children,
  description,
  eyebrow = "Tenant setup",
  sidePanel,
  title,
}: FlowShellProps) {
  return (
    <main className="min-h-screen bg-background px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 inline-flex items-start gap-3 rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground">
          <OnboardingBrandAvatar
            brandName={brandName}
            editable={brandEditable}
            logoUrl={brandLogoUrl}
          />
          <Link
            aria-label="Go to homepage"
            className="self-center pr-1 font-medium uppercase tracking-[0.18em] transition hover:text-primary"
            href="/"
          >
            {brandName}
          </Link>
        </div>

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
