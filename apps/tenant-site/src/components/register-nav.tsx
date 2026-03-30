/**
 * RegisterNav — renders the family-specific navigation bar for a register
 * template. Reads the family's NavConfig (filtered to the active plan tier)
 * and produces a responsive nav: full inline on desktop, hamburger on mobile.
 *
 * This is a server component. It uses no client state. The mobile menu
 * relies on a native <details>/<summary> accordion (no JS required) so it
 * works without hydration.
 *
 * Usage:
 *   <RegisterNav
 *     familyKey="agency"
 *     tier="starter"
 *     companyName="Noor Properties"
 *     logoUrl={company.logoUrl}
 *     currentPath="/"
 *   />
 */

import {
  getFamilyNavConfig,
  getRegisterTemplate,
} from "@plotkeys/section-registry";
import type { TemplateFamilyKey, TemplateTier } from "@plotkeys/section-registry";
import Link from "next/link";

type RegisterNavProps = {
  companyName: string;
  currentPath?: string;
  familyKey: TemplateFamilyKey;
  logoUrl?: string | null;
  templateKey?: string;
  tier: TemplateTier;
};

export function RegisterNav({
  companyName,
  currentPath = "/",
  familyKey,
  logoUrl,
  tier,
}: RegisterNavProps) {
  const nav = getFamilyNavConfig(familyKey, tier);

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#fff)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
        {/* Logo / brand */}
        <Link
          className="flex shrink-0 items-center gap-2.5 text-sm font-semibold text-[color:var(--pk-foreground,#0f172a)]"
          href="/"
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={companyName} className="h-7 w-auto object-contain" src={logoUrl} />
          ) : (
            <span className="text-base font-bold tracking-tight">{companyName}</span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
          {nav.primary.map((link) => {
            const isActive = currentPath === link.href;
            return (
              <Link
                key={link.href}
                className={[
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-[color:var(--pk-primary,#0f172a)]/8 font-medium text-[color:var(--pk-primary,#0f172a)]"
                    : "text-[color:var(--pk-muted-foreground,#64748b)] hover:bg-[color:var(--pk-muted,#f1f5f9)] hover:text-[color:var(--pk-foreground,#0f172a)]",
                ]
                  .filter(Boolean)
                  .join(" ")}
                href={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <Link
            className="rounded-lg bg-[color:var(--pk-primary,#0f172a)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            href={nav.ctaHref}
          >
            {nav.ctaLabel}
          </Link>
        </div>

        {/* Mobile hamburger — native details/summary, no JS required */}
        <details className="group relative md:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-center rounded-lg border border-[color:var(--pk-border,#e2e8f0)] p-2 text-[color:var(--pk-foreground,#0f172a)]">
            {/* Hamburger icon */}
            <svg
              aria-hidden="true"
              className="block size-5 group-open:hidden"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              viewBox="0 0 24 24"
            >
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            </svg>
            {/* Close icon */}
            <svg
              aria-hidden="true"
              className="hidden size-5 group-open:block"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            </svg>
            <span className="sr-only">Toggle navigation</span>
          </summary>

          {/* Mobile dropdown */}
          <div className="absolute right-0 top-full mt-1 w-64 rounded-xl border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#fff)] p-2 shadow-lg">
            {nav.mobile.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <Link
                  key={link.href}
                  className={[
                    "block rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-[color:var(--pk-primary,#0f172a)]/8 font-medium text-[color:var(--pk-primary,#0f172a)]"
                      : "text-[color:var(--pk-foreground,#0f172a)] hover:bg-[color:var(--pk-muted,#f1f5f9)]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  href={link.href}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-2 border-t border-[color:var(--pk-border,#e2e8f0)] pt-2">
              <Link
                className="block rounded-lg bg-[color:var(--pk-primary,#0f172a)] px-3 py-2 text-center text-sm font-medium text-white"
                href={nav.ctaHref}
              >
                {nav.ctaLabel}
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
