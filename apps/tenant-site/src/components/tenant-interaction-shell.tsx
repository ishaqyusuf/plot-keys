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
  type TemplateConfig,
} from "@plotkeys/section-registry";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { parseTenantRenderMode } from "../lib/render-mode";

type TenantInteractionShellProps = {
  children: ReactNode;
  colorSystemKey?: string;
  pageInfo?: RegistryPageInfo;
  renderMode?: RenderMode;
  templateConfig: TemplateConfig;
  templateKey?: string;
  tenant?: RegistryTenantInfo;
};

function TenantRegistryLink({
  children,
  href,
  ...props
}: RegistryLinkComponentProps) {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

export function TenantInteractionShell({
  children,
  colorSystemKey,
  pageInfo,
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

  return (
    <RegistryProvider
      colorSystemKey={colorSystemKey}
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
