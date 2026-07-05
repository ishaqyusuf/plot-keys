/**
 * RegisterNav — renders the template-owned navigation bar for a register
 * template. Reads the template's NavConfig (filtered to the active plan tier)
 * and produces a responsive nav: full inline on desktop, hamburger on mobile.
 *
 * This is a server component. It uses no client state. The mobile menu
 * relies on a native <details>/<summary> accordion (no JS required) so it
 * works without hydration.
 *
 * Usage:
 *   <RegisterNav
 *     templateKey="riwaq-starter"
 *     tier="starter"
 *     companyName="Noor Properties"
 *     logoUrl={company.logoUrl}
 *     currentPath="/"
 *   />
 */

import { getRegisterNavConfig } from "@plotkeys/section-registry";
import type { TemplateConfig, TemplateTier } from "@plotkeys/section-registry";
import Link from "next/link";

type RegisterNavProps = {
  companyName: string;
  currentPath?: string;
  hrefPrefix?: string;
  hrefQuery?: string;
  logoUrl?: string | null;
  templateConfig?: Pick<
    TemplateConfig,
    "menuAccent" | "menuStyle" | "radius"
  >;
  templateKey: string;
  tier: TemplateTier;
};

function scopedHref(href: string, hrefPrefix?: string, hrefQuery?: string) {
  if (
    !hrefPrefix ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("#")
  ) {
    return href;
  }

  const scoped = href === "/" ? hrefPrefix : `${hrefPrefix}${href}`;
  if (!hrefQuery) return scoped;

  return `${scoped}${scoped.includes("?") ? "&" : "?"}${hrefQuery}`;
}

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function resolveNavRadiusClass(radius?: string) {
  if (radius === "none") return "rounded-none";
  if (radius === "sm") return "rounded-sm";
  if (radius === "md") return "rounded-md";
  if (radius === "lg") return "rounded-lg";
  if (radius === "xl") return "rounded-xl";
  if (radius === "full") return "rounded-full";

  return "rounded-md";
}

function resolveHeaderClass(config?: RegisterNavProps["templateConfig"]) {
  const base = "sticky top-0 z-30";

  if (config?.menuStyle === "minimal") {
    return joinClasses(base, "bg-transparent");
  }

  if (config?.menuStyle === "bordered") {
    return joinClasses(
      base,
      "border-b border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-card,#fff)]",
    );
  }

  if (config?.menuStyle === "default-solid") {
    return joinClasses(
      base,
      "border-b border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#fff)]",
    );
  }

  return joinClasses(
    base,
    "border-b border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#fff)]/95 backdrop-blur",
  );
}

function resolveNavLinkClass(
  isActive: boolean,
  config?: RegisterNavProps["templateConfig"],
) {
  const radius = resolveNavRadiusClass(config?.radius);
  const base = joinClasses("px-3 py-1.5 text-sm transition-colors", radius);

  if (!isActive) {
    return joinClasses(
      base,
      "text-[color:var(--pk-muted-foreground,#64748b)] hover:bg-[color:var(--pk-muted,#f1f5f9)] hover:text-[color:var(--pk-foreground,#0f172a)]",
    );
  }

  if (config?.menuAccent === "strong") {
    return joinClasses(
      base,
      "bg-[color:var(--pk-primary,#0f172a)] font-medium text-[color:var(--pk-primary-foreground,#fff)]",
    );
  }

  if (config?.menuAccent === "none") {
    return joinClasses(
      base,
      "font-medium text-[color:var(--pk-foreground,#0f172a)] underline decoration-[color:var(--pk-primary,#0f172a)] decoration-2 underline-offset-8",
    );
  }

  return joinClasses(
    base,
    "bg-[color:var(--pk-primary,#0f172a)]/8 font-medium text-[color:var(--pk-primary,#0f172a)]",
  );
}

function resolveNavCtaClass(config?: RegisterNavProps["templateConfig"]) {
  const radius = resolveNavRadiusClass(config?.radius);

  if (config?.menuAccent === "none" || config?.menuStyle === "minimal") {
    return joinClasses(
      "border border-[color:var(--pk-border,#e2e8f0)] bg-transparent px-4 py-2 text-sm font-medium text-[color:var(--pk-foreground,#0f172a)] transition-colors hover:bg-[color:var(--pk-muted,#f1f5f9)]",
      radius,
    );
  }

  return joinClasses(
    "bg-[color:var(--pk-primary,#0f172a)] px-4 py-2 text-sm font-medium text-[color:var(--pk-primary-foreground,#fff)] transition-opacity hover:opacity-90",
    config?.menuAccent === "strong" && "shadow-md shadow-black/10",
    radius,
  );
}

export function RegisterNav({
  companyName,
  currentPath = "/",
  hrefPrefix,
  hrefQuery,
  logoUrl,
  templateConfig,
  templateKey,
  tier,
}: RegisterNavProps) {
  const nav = getRegisterNavConfig(templateKey, tier);

  return (
    <header className={resolveHeaderClass(templateConfig)}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
        {/* Logo / brand */}
        <Link
          className="flex shrink-0 items-center gap-2.5 text-sm font-semibold text-[color:var(--pk-foreground,#0f172a)]"
          href={scopedHref("/", hrefPrefix, hrefQuery)}
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
            const href = scopedHref(link.href, hrefPrefix, hrefQuery);
            const isActive = currentPath === href.split("?")[0];
            return (
              <Link
                key={link.href}
                className={resolveNavLinkClass(isActive, templateConfig)}
                href={href}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <Link
            className={resolveNavCtaClass(templateConfig)}
            href={scopedHref(nav.ctaHref, hrefPrefix, hrefQuery)}
          >
            {nav.ctaLabel}
          </Link>
        </div>

        {/* Mobile hamburger — native details/summary, no JS required */}
        <details className="group relative md:hidden">
          <summary
            className={joinClasses(
              "flex cursor-pointer list-none items-center justify-center border border-[color:var(--pk-border,#e2e8f0)] p-2 text-[color:var(--pk-foreground,#0f172a)]",
              resolveNavRadiusClass(templateConfig?.radius),
            )}
          >
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
          <div
            className={joinClasses(
              "absolute right-0 top-full mt-1 w-64 border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#fff)] p-2 shadow-lg",
              resolveNavRadiusClass(templateConfig?.radius),
            )}
          >
            {nav.mobile.map((link) => {
              const href = scopedHref(link.href, hrefPrefix, hrefQuery);
              const isActive = currentPath === href.split("?")[0];
              return (
                <Link
                  key={link.href}
                  className={joinClasses(
                    "block py-2",
                    resolveNavLinkClass(isActive, templateConfig),
                  )}
                  href={href}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-2 border-t border-[color:var(--pk-border,#e2e8f0)] pt-2">
              <Link
                className={joinClasses(
                  "block px-3 py-2 text-center",
                  resolveNavCtaClass(templateConfig),
                )}
                href={scopedHref(nav.ctaHref, hrefPrefix, hrefQuery)}
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
