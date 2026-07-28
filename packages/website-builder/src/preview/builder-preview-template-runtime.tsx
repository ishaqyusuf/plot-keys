"use client";

import type {
  RegistryLinkComponentProps,
  SerializableSectionData,
  TemplateConfig,
  TenantContentRecord,
} from "@plotkeys/section-registry";
import { RegistryProvider } from "@plotkeys/section-registry";
import type {
  ComponentProps,
  ComponentType,
  CSSProperties,
  ReactNode,
} from "react";
import { BuilderPreviewGuardedFrame } from "./builder-preview-guarded-frame";

export type BuilderPreviewTemplateRuntimePageInfo = ComponentProps<
  typeof RegistryProvider
>["pageInfo"];

type Props = {
  companyName: string;
  companySlug: string;
  content: TenantContentRecord;
  frameClassName: string;
  frameStyle: CSSProperties;
  linkComponent: ComponentType<RegistryLinkComponentProps>;
  pageInfo?: BuilderPreviewTemplateRuntimePageInfo;
  readOnly: boolean;
  renderedTemplatePage: ReactNode;
  sections: SerializableSectionData[];
  templateConfig: TemplateConfig;
  templateKey?: string;
  onInlineContentCommit: (contentKey: string, value: string) => Promise<void>;
  onInlineSmartFill: (contentKey: string) => Promise<void>;
};

export function BuilderPreviewTemplateRuntime({
  companyName,
  companySlug,
  content,
  frameClassName,
  frameStyle,
  linkComponent,
  pageInfo,
  readOnly,
  renderedTemplatePage,
  sections,
  templateConfig,
  templateKey,
  onInlineContentCommit,
  onInlineSmartFill,
}: Props) {
  return (
    <RegistryProvider
      colorSystemKey={templateConfig.colorSystem}
      content={content}
      linkComponent={linkComponent}
      onContentCommit={readOnly ? undefined : onInlineContentCommit}
      pageInfo={pageInfo}
      renderMode="draft"
      sections={sections}
      templateConfig={templateConfig}
      templateKey={templateKey}
      tenant={{
        companyName,
        subdomain: companySlug,
      }}
    >
      <BuilderPreviewGuardedFrame
        className={frameClassName}
        onSmartFill={onInlineSmartFill}
        readOnly={readOnly}
        style={frameStyle}
      >
        {renderedTemplatePage}
      </BuilderPreviewGuardedFrame>
    </RegistryProvider>
  );
}
