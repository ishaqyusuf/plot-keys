"use client";

import {
  ClickGuardProvider,
  InlineOverview,
  PreviewBanner,
  RegistryProvider,
  type RegistryLinkComponentProps,
  type RegistryPageInfo,
  type RegistryTenantInfo,
  type RenderMode,
  type TenantContentRecord,
  type TemplateConfig,
} from "@plotkeys/section-registry";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { parseTenantRenderMode } from "../lib/render-mode";

type TenantInteractionShellProps = {
  children: ReactNode;
  colorSystemKey?: string;
  content?: TenantContentRecord;
  pageInfo?: RegistryPageInfo;
  registryHrefPrefix?: string;
  registryHrefQuery?: string;
  renderMode?: RenderMode;
  templateConfig: TemplateConfig;
  templateKey?: string;
  tenant?: RegistryTenantInfo;
};

function resolveRegistryHref(href: string, prefix?: string, query?: string) {
  if (
    !prefix ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    /^https?:\/\//.test(href)
  ) {
    return href;
  }

  const normalizedHref = href.startsWith("/") ? href : `/${href}`;
  const prefixedHref =
    normalizedHref === "/" ? prefix : `${prefix}${normalizedHref}`;

  if (!query) return prefixedHref;

  return `${prefixedHref}${prefixedHref.includes("?") ? "&" : "?"}${query}`;
}

export function TenantInteractionShell({
  children,
  colorSystemKey,
  content,
  pageInfo,
  registryHrefPrefix,
  registryHrefQuery,
  renderMode,
  templateConfig,
  templateKey,
  tenant,
}: TenantInteractionShellProps) {
  const searchParams = useSearchParams();
  const resolvedRenderMode =
    renderMode ??
    parseTenantRenderMode(
      searchParams.get("renderMode") ?? searchParams.get("mode"),
    );

  function TenantRegistryLink({
    children,
    href,
    page: _page,
    ...props
  }: RegistryLinkComponentProps) {
    return (
      <Link
        href={resolveRegistryHref(href, registryHrefPrefix, registryHrefQuery)}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <RegistryProvider
      colorSystemKey={colorSystemKey}
      content={content}
      linkComponent={TenantRegistryLink}
      pageInfo={pageInfo}
      renderMode={resolvedRenderMode}
      templateConfig={templateConfig}
      templateKey={templateKey}
      tenant={tenant}
    >
      <ClickGuardProvider>
        <PreviewBanner />
        {children}
        <InlineOverview />
      </ClickGuardProvider>
    </RegistryProvider>
  );
}
