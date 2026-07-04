"use client";

import {
  ClickGuardProvider,
  InlineOverview,
  PreviewBanner,
  RegistryProvider,
  type RegistryLinkComponentProps,
  type RegistryPageInfo,
  type RegistryTenantInfo,
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
  templateConfig,
  templateKey,
  tenant,
}: TenantInteractionShellProps) {
  const searchParams = useSearchParams();
  const renderMode = parseTenantRenderMode(searchParams.get("renderMode"));

  return (
    <RegistryProvider
      colorSystemKey={colorSystemKey}
      linkComponent={TenantRegistryLink}
      pageInfo={pageInfo}
      renderMode={renderMode}
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
