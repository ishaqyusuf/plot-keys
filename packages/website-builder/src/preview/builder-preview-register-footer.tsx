"use client";

import type { FooterConfig } from "@plotkeys/section-registry";
import { cn } from "@plotkeys/ui/cn";
import type { MouseEvent } from "react";

type Props = {
  companyName: string;
  footer: FooterConfig;
  year: number;
  onLinkClick: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
  resolveLinkHref: (href: string) => string;
};

export function PreviewRegisterFooter({
  companyName,
  footer,
  year,
  onLinkClick,
  resolveLinkHref,
}: Props) {
  return (
    <footer className="border-t border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#fff)]">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        {footer.groups.length > 0 ? (
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
            {footer.groups.map((group) => (
              <div key={group.heading}>
                <p className="mb-4 text-xs font-semibold text-[color:var(--pk-foreground,#0f172a)]">
                  {group.heading}
                </p>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a
                        className="text-sm text-[color:var(--pk-muted-foreground,#64748b)] transition-colors hover:text-[color:var(--pk-foreground,#0f172a)]"
                        href={resolveLinkHref(link.href)}
                        onClick={(event) => onLinkClick(link.href, event)}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}
        <div
          className={cn(
            "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
            footer.groups.length > 0 &&
              "mt-10 border-t border-[color:var(--pk-border,#e2e8f0)] pt-8",
          )}
        >
          <p className="text-sm text-[color:var(--pk-muted-foreground,#64748b)]">
            {footer.tagline}
          </p>
          <p className="shrink-0 text-xs text-[color:var(--pk-muted-foreground,#94a3b8)]">
            Copyright {year} {companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
