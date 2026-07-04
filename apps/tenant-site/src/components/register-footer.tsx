/**
 * RegisterFooter — renders the template-owned site footer for a register
 * template. Reads the template's FooterConfig (link groups + tagline).
 *
 * Server component — no client state needed.
 *
 * Usage:
 *   <RegisterFooter
 *     templateKey="riwaq-starter"
 *     companyName="Noor Properties"
 *   />
 */

import { getRegisterFooterConfig } from "@plotkeys/section-registry";
import Link from "next/link";

type RegisterFooterProps = {
  companyName: string;
  hrefPrefix?: string;
  templateKey: string;
};

function scopedHref(href: string, hrefPrefix?: string) {
  if (
    !hrefPrefix ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("#")
  ) {
    return href;
  }

  return href === "/" ? hrefPrefix : `${hrefPrefix}${href}`;
}

export function RegisterFooter({
  companyName,
  hrefPrefix,
  templateKey,
}: RegisterFooterProps) {
  const footer = getRegisterFooterConfig(templateKey);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#fff)]">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        {/* Link groups */}
        {footer.groups.length > 0 ? (
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-12">
            {footer.groups.map((group) => (
              <div key={group.heading}>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--pk-foreground,#0f172a)]">
                  {group.heading}
                </p>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        className="text-sm text-[color:var(--pk-muted-foreground,#64748b)] transition-colors hover:text-[color:var(--pk-foreground,#0f172a)]"
                        href={scopedHref(link.href, hrefPrefix)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}

        {/* Tagline + copyright */}
        <div
          className={[
            "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
            footer.groups.length > 0 && "mt-12 border-t border-[color:var(--pk-border,#e2e8f0)] pt-8",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <p className="text-sm text-[color:var(--pk-muted-foreground,#64748b)]">
            {footer.tagline}
          </p>
          <p className="shrink-0 text-xs text-[color:var(--pk-muted-foreground,#94a3b8)]">
            © {year} {companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
