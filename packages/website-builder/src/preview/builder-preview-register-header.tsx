"use client";

import type { NavConfig, TemplateConfig } from "@plotkeys/section-registry";
import { cn } from "@plotkeys/ui/cn";
import { Icon } from "@plotkeys/ui/icons";
import type { MouseEvent } from "react";
import {
  resolvePreviewRegisterHeaderClass,
  resolvePreviewRegisterNavCtaClass,
  resolvePreviewRegisterNavLinkClass,
  resolvePreviewRegisterRadiusClass,
} from "./builder-preview-register-shell-styles";

type Props = {
  companyName: string;
  currentPath: string;
  nav: NavConfig;
  templateConfig: TemplateConfig;
  onLinkClick: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
  resolveLinkHref: (href: string) => string;
};

export function PreviewRegisterHeader({
  companyName,
  currentPath,
  nav,
  templateConfig,
  onLinkClick,
  resolveLinkHref,
}: Props) {
  return (
    <header className={resolvePreviewRegisterHeaderClass(templateConfig)}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
        <a
          className="flex shrink-0 items-center gap-2.5 text-sm font-semibold text-[color:var(--pk-foreground,#0f172a)]"
          href={resolveLinkHref("/")}
          onClick={(event) => onLinkClick("/", event)}
        >
          <span className="text-base font-bold tracking-tight">
            {companyName}
          </span>
        </a>

        <nav
          aria-label="Template preview navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {nav.primary.map((link) => {
            const isActive = currentPath === link.href;

            return (
              <a
                className={resolvePreviewRegisterNavLinkClass(
                  isActive,
                  templateConfig,
                )}
                href={resolveLinkHref(link.href)}
                key={link.href}
                onClick={(event) => onLinkClick(link.href, event)}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <a
          className={cn(
            "hidden md:inline-flex",
            resolvePreviewRegisterNavCtaClass(templateConfig),
          )}
          href={resolveLinkHref(nav.ctaHref)}
          onClick={(event) => onLinkClick(nav.ctaHref, event)}
        >
          {nav.ctaLabel}
        </a>

        <details className="group relative md:hidden">
          <summary
            className={cn(
              "flex cursor-pointer list-none items-center justify-center border border-[color:var(--pk-border,#e2e8f0)] p-2 text-[color:var(--pk-foreground,#0f172a)]",
              resolvePreviewRegisterRadiusClass(templateConfig.radius),
            )}
          >
            <Icon.Menu className="size-5 group-open:hidden" />
            <Icon.Close className="hidden size-5 group-open:block" />
            <span className="sr-only">Toggle navigation</span>
          </summary>

          <div
            className={cn(
              "absolute right-0 top-full mt-1 w-64 border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#fff)] p-2",
              resolvePreviewRegisterRadiusClass(templateConfig.radius),
            )}
          >
            {nav.mobile.map((link) => {
              const isActive = currentPath === link.href;

              return (
                <a
                  className={cn(
                    "block py-2",
                    resolvePreviewRegisterNavLinkClass(
                      isActive,
                      templateConfig,
                    ),
                  )}
                  href={resolveLinkHref(link.href)}
                  key={link.href}
                  onClick={(event) => onLinkClick(link.href, event)}
                >
                  {link.label}
                </a>
              );
            })}
            <div className="mt-2 border-t border-[color:var(--pk-border,#e2e8f0)] pt-2">
              <a
                className={cn(
                  "block px-3 py-2 text-center",
                  resolvePreviewRegisterNavCtaClass(templateConfig),
                )}
                href={resolveLinkHref(nav.ctaHref)}
                onClick={(event) => onLinkClick(nav.ctaHref, event)}
              >
                {nav.ctaLabel}
              </a>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
