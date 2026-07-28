"use client";

import type {
  EditableFieldDefinition,
  SerializableSectionData,
  TemplateConfig,
  TenantContentRecord,
} from "@plotkeys/section-registry";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import {
  BuilderPreviewRuntimeBody,
  BuilderPreviewShell,
  useBuilderPreviewPresentation,
} from "@plotkeys/website-builder";
import { useState } from "react";
import {
  BuilderPreviewFrameHeader,
  BuilderPreviewReadOnlyNotice,
} from "@/components/builder/builder-preview-frame-chrome";
import { useBuilderPreviewActions } from "@/components/builder/use-builder-preview-actions";
import { useBuilderPreviewRouting } from "@/components/builder/use-builder-preview-routing";

type PageNavItem = {
  label: string;
  pageKey: string;
  slug: string;
};

type Props = {
  activePageKey?: string;
  availablePages?: PageNavItem[];
  companyName: string;
  companySlug: string;
  configId: string;
  defaultContent: TenantContentRecord;
  editableFields: EditableFieldDefinition[];
  pageKey: string;
  pageLabel: string;
  pageSlug: string;
  presentation?: "canvas" | "framed";
  registryLinkMode?: "page-query" | "raw";
  readOnly?: boolean;
  readOnlyMessage?: string;
  sections: SerializableSectionData[];
  templateKey?: string;
  templateConfig: TemplateConfig;
  theme: Record<string, string>;
  visibleSections?: Record<string, boolean>;
  onUpdateField?: (formData: FormData) => Promise<void>;
  onSmartFill?: (formData: FormData) => Promise<void>;
};

export function BuilderPreviewPanel({
  activePageKey = "home",
  availablePages,
  companyName,
  companySlug,
  configId,
  defaultContent,
  editableFields,
  pageKey,
  pageLabel,
  pageSlug,
  presentation = "framed",
  registryLinkMode = "raw",
  readOnly = false,
  readOnlyMessage,
  sections,
  templateKey,
  templateConfig,
  theme,
  visibleSections,
  onSmartFill,
  onUpdateField,
}: Props) {
  const [focusedSectionId, setFocusedSectionId] = useState<string | null>(null);
  const {
    errorMessage,
    handleInlineContentCommit,
    handleInlineSmartFill,
    smartFill,
    updateField,
  } = useBuilderPreviewActions({
    configId,
    onSmartFill,
    onUpdateField,
  });
  const {
    handlePageNav,
    handlePreviewLinkClick,
    PreviewRegistryLink,
    resolvePreviewLinkHref,
  } = useBuilderPreviewRouting({
    activePageKey,
    availablePages,
    registryLinkMode,
  });
  const {
    content,
    familyOverrides,
    filteredSections,
    hasTemplatePage,
    pageInfo,
    renderedTemplatePage,
  } = useBuilderPreviewPresentation({
    companyName,
    defaultContent,
    editableFields,
    onLinkClick: handlePreviewLinkClick,
    pageKey,
    pageSlug,
    resolveLinkHref: resolvePreviewLinkHref,
    sections,
    templateConfig,
    templateKey,
    visibleSections,
  });

  function handleSectionFocus(sectionId: string) {
    setFocusedSectionId((prev) => (prev === sectionId ? null : sectionId));
  }

  const isCanvas = presentation === "canvas";
  const showPreviewChrome = !isCanvas;

  return (
    <BuilderPreviewShell
      frameHeader={
        showPreviewChrome ? (
          <BuilderPreviewFrameHeader
            activePageKey={activePageKey}
            availablePages={availablePages}
            companySlug={companySlug}
            hasTemplatePage={hasTemplatePage}
            pageKey={pageKey}
            pageLabel={pageLabel}
            pageSlug={pageSlug}
            sectionCount={filteredSections.length}
            onPageNav={handlePageNav}
          />
        ) : null
      }
      isCanvas={isCanvas}
      readOnlyNotice={
        readOnly ? (
          <BuilderPreviewReadOnlyNotice readOnlyMessage={readOnlyMessage} />
        ) : null
      }
    >
      {errorMessage ? (
        <Alert variant="destructive" className="border-x-0 border-t-0">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}
      <BuilderPreviewRuntimeBody
        companyName={companyName}
        companySlug={companySlug}
        configId={configId}
        content={content}
        defaultContent={defaultContent}
        editableFields={editableFields}
        familyOverrides={familyOverrides}
        filteredSections={filteredSections}
        focusedSectionId={focusedSectionId}
        isCanvas={isCanvas}
        linkComponent={PreviewRegistryLink}
        pageInfo={pageInfo}
        readOnly={readOnly}
        renderedTemplatePage={renderedTemplatePage}
        templateConfig={templateConfig}
        templateKey={templateKey}
        theme={theme}
        onInlineContentCommit={handleInlineContentCommit}
        onInlineSmartFill={handleInlineSmartFill}
        onSectionFocus={handleSectionFocus}
        onSmartFill={smartFill}
        onUpdate={updateField}
      />
    </BuilderPreviewShell>
  );
}
