import { Badge } from "@plotkeys/ui/badge";
import Link from "next/link";
import type { ReactNode } from "react";
import { OnboardingBrandAvatar } from "./onboarding/onboarding-brand-avatar";

type Props = {
  badge: string;
  brandEditable?: boolean;
  brandLogoUrl?: string | null;
  brandName?: string;
  children: ReactNode;
  description: string;
  eyebrow?: string;
  headerAction?: ReactNode;
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
  headerAction,
  sidePanel,
  title,
}: Props) {
  return (
    <main className="min-h-screen bg-background px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="inline-flex items-start gap-3 text-sm text-foreground">
            <OnboardingBrandAvatar
              brandName={brandName}
              editable={brandEditable}
              logoUrl={brandLogoUrl}
            />
            <Link
              aria-label="Go to homepage"
              className="self-center pr-1 font-medium transition hover:text-primary"
              href="/"
            >
              {brandName}
            </Link>
          </div>
          {headerAction}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <section className="border bg-background">
            <div className="px-8 pt-8 md:px-10 md:pt-10">
              <p className="text-sm font-medium text-muted-foreground">
                {eyebrow}
              </p>
              <Badge variant="secondary" className="mt-4 w-fit">
                {badge}
              </Badge>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {title}
              </h1>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {description}
              </p>
            </div>
            <div className="px-8 pb-8 md:px-10 md:pb-10">{children}</div>
          </section>

          <div className="border bg-background p-8 md:p-10">{sidePanel}</div>
        </div>
      </div>
    </main>
  );
}
