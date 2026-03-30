"use client";

import {
  ClickGuardProvider,
  InlineOverview,
  type TemplateConfig,
  WebsiteRuntimeProvider,
} from "@plotkeys/section-registry";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { parseTenantRenderMode } from "../lib/render-mode";

type TenantInteractionShellProps = {
  children: ReactNode;
  colorSystemKey?: string;
  templateConfig: TemplateConfig;
};

export function TenantInteractionShell({
  children,
  colorSystemKey,
  templateConfig,
}: TenantInteractionShellProps) {
  const searchParams = useSearchParams();
  const renderMode = parseTenantRenderMode(searchParams.get("renderMode"));

  return (
    <WebsiteRuntimeProvider
      colorSystemKey={colorSystemKey}
      renderMode={renderMode}
      templateConfig={templateConfig}
    >
      <ClickGuardProvider>
        {children}
        <InlineOverview />
      </ClickGuardProvider>
    </WebsiteRuntimeProvider>
  );
}
