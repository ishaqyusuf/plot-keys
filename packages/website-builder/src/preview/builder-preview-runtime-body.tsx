"use client";

import type {
  EditableFieldDefinition,
  RegistryLinkComponentProps,
  SerializableSectionData,
  TemplateConfig,
  TenantContentRecord,
} from "@plotkeys/section-registry";
import type { ComponentType, JSX, ReactNode } from "react";
import {
  BuilderPreviewTemplateRuntime,
  type BuilderPreviewTemplateRuntimePageInfo,
} from "./builder-preview-template-runtime";
import { BuilderPreviewWebsiteRuntime } from "./builder-preview-website-runtime";

type Props = {
  companyName: string;
  companySlug: string;
  configId: string;
  content: Record<string, string>;
  defaultContent: TenantContentRecord;
  editableFields: EditableFieldDefinition[];
  familyOverrides: Record<
    string,
    (props: { config: unknown; theme: unknown }) => JSX.Element
  >;
  filteredSections: SerializableSectionData[];
  focusedSectionId: string | null;
  isCanvas: boolean;
  linkComponent: ComponentType<RegistryLinkComponentProps>;
  pageInfo?: BuilderPreviewTemplateRuntimePageInfo;
  readOnly: boolean;
  renderedTemplatePage: ReactNode;
  templateConfig: TemplateConfig;
  templateKey?: string;
  theme: Record<string, string>;
  onInlineContentCommit: (contentKey: string, value: string) => Promise<void>;
  onInlineSmartFill: (contentKey: string) => Promise<void>;
  onSectionFocus: (sectionId: string) => void;
  onSmartFill: (formData: FormData) => Promise<void>;
  onUpdate: (formData: FormData) => Promise<void>;
};

export function BuilderPreviewRuntimeBody({
  companyName,
  companySlug,
  configId,
  content,
  defaultContent,
  editableFields,
  familyOverrides,
  filteredSections,
  focusedSectionId,
  isCanvas,
  linkComponent,
  pageInfo,
  readOnly,
  renderedTemplatePage,
  templateConfig,
  templateKey,
  theme,
  onInlineContentCommit,
  onInlineSmartFill,
  onSectionFocus,
  onSmartFill,
  onUpdate,
}: Props) {
  const previewBodyClassName = isCanvas
    ? "min-h-full bg-[color:var(--pk-background,var(--background))]"
    : "overflow-hidden border bg-background";
  const previewBodyStyle = {
    backgroundColor: "var(--pk-background, var(--background))",
    fontFamily: "var(--pk-font-body, Satoshi, sans-serif)",
  };

  return (
    <div
      className={
        isCanvas
          ? "min-h-0 flex-1 overflow-auto bg-background"
          : "max-h-[78vh] overflow-auto bg-background p-3 md:p-4"
      }
      data-template-preview-scroll=""
      role="presentation"
    >
      {renderedTemplatePage ? (
        <BuilderPreviewTemplateRuntime
          companyName={companyName}
          companySlug={companySlug}
          content={defaultContent}
          frameClassName={previewBodyClassName}
          frameStyle={previewBodyStyle}
          linkComponent={linkComponent}
          pageInfo={pageInfo}
          readOnly={readOnly}
          renderedTemplatePage={renderedTemplatePage}
          sections={filteredSections}
          templateConfig={templateConfig}
          templateKey={templateKey}
          onInlineContentCommit={onInlineContentCommit}
          onInlineSmartFill={onInlineSmartFill}
        />
      ) : (
        <BuilderPreviewWebsiteRuntime
          configId={configId}
          content={content}
          editableFields={editableFields}
          familyOverrides={familyOverrides}
          focusedSectionId={focusedSectionId}
          frameClassName={previewBodyClassName}
          frameStyle={previewBodyStyle}
          readOnly={readOnly}
          sections={filteredSections}
          templateConfig={templateConfig}
          theme={theme}
          onInlineSmartFill={onInlineSmartFill}
          onSectionFocus={onSectionFocus}
          onSmartFill={onSmartFill}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}
