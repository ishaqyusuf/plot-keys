"use client";

import type { TemplateConfig, TemplateTier } from "@plotkeys/section-registry";
import {
  getRegisterFooterConfig,
  getRegisterNavConfig,
} from "@plotkeys/section-registry";
import type { JSX, MouseEvent } from "react";
import { PreviewRegisterFooter } from "./builder-preview-register-footer";
import { PreviewRegisterHeader } from "./builder-preview-register-header";

type RegisterShellLinkHandler = (
  href: string,
  event: MouseEvent<HTMLAnchorElement>,
) => void;

type RegisterShellHrefResolver = (href: string) => string;

type Props = {
  children: JSX.Element;
  companyName: string;
  currentPath: string;
  templateConfig: TemplateConfig;
  templateKey: string;
  tier: TemplateTier;
  onLinkClick: RegisterShellLinkHandler;
  resolveLinkHref: RegisterShellHrefResolver;
};

export function PreviewRegisterShell({
  children,
  companyName,
  currentPath,
  templateConfig,
  templateKey,
  tier,
  onLinkClick,
  resolveLinkHref,
}: Props) {
  const nav = getRegisterNavConfig(templateKey, tier);
  const footer = getRegisterFooterConfig(templateKey);
  const year = new Date().getFullYear();

  return (
    <div className="min-h-full bg-[color:var(--pk-background,#fff)]">
      <PreviewRegisterHeader
        companyName={companyName}
        currentPath={currentPath}
        nav={nav}
        templateConfig={templateConfig}
        onLinkClick={onLinkClick}
        resolveLinkHref={resolveLinkHref}
      />

      {children}

      <PreviewRegisterFooter
        companyName={companyName}
        footer={footer}
        year={year}
        onLinkClick={onLinkClick}
        resolveLinkHref={resolveLinkHref}
      />
    </div>
  );
}
