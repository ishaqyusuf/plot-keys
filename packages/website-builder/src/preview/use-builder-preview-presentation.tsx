"use client";

import type {
  EditableFieldDefinition,
  SerializableSectionData,
  TemplateConfig,
  TenantContentRecord,
} from "@plotkeys/section-registry";
import {
  getRegisterTemplate,
  resolveRegisterSectionComponents,
  resolveTemplatePageHandle,
} from "@plotkeys/section-registry";
import type { ComponentType, JSX, MouseEvent } from "react";
import { PreviewRegisterShell } from "./builder-preview-register-shell";

type UseBuilderPreviewPresentationParams = {
  companyName: string;
  defaultContent: TenantContentRecord;
  editableFields: EditableFieldDefinition[];
  onLinkClick: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
  pageKey: string;
  pageSlug: string;
  resolveLinkHref: (href: string, pageKey?: string) => string;
  sections: SerializableSectionData[];
  templateConfig: TemplateConfig;
  templateKey?: string;
  visibleSections?: Record<string, boolean>;
};

export function useBuilderPreviewPresentation({
  companyName,
  defaultContent,
  editableFields,
  onLinkClick,
  pageKey,
  pageSlug,
  resolveLinkHref,
  sections,
  templateConfig,
  templateKey,
  visibleSections,
}: UseBuilderPreviewPresentationParams) {
  const registerTemplate = getRegisterTemplate(templateKey ?? "");
  const templatePageHandle = templateKey
    ? resolveTemplatePageHandle({
        pageInfo: {
          canonicalPath: pageSlug,
          pageDisabled: false,
          pageKey,
          pageNotSupported: false,
          routeSlug: null,
        },
        pageKey,
        templateKey,
      })
    : undefined;
  const TemplatePage = templatePageHandle?.Page as ComponentType | undefined;

  const familyOverrides = resolveRegisterSectionComponents(
    registerTemplate?.key,
  ) as Record<
    string,
    (props: { config: unknown; theme: unknown }) => JSX.Element
  >;

  const filteredSections = visibleSections
    ? sections.filter((s) => visibleSections[s.type] !== false)
    : sections;

  const content = Object.fromEntries(
    editableFields.map((f) => [
      f.contentKey,
      (defaultContent[f.contentKey] ?? "") as string,
    ]),
  );

  const renderedTemplatePage = TemplatePage ? (
    registerTemplate ? (
      <PreviewRegisterShell
        companyName={companyName}
        currentPath={pageSlug}
        templateConfig={templateConfig}
        templateKey={registerTemplate.key}
        tier={registerTemplate.tier}
        onLinkClick={onLinkClick}
        resolveLinkHref={resolveLinkHref}
      >
        <TemplatePage />
      </PreviewRegisterShell>
    ) : (
      <TemplatePage />
    )
  ) : null;

  return {
    content,
    familyOverrides,
    filteredSections,
    hasTemplatePage: Boolean(TemplatePage),
    pageInfo: templatePageHandle?.info,
    renderedTemplatePage,
  };
}
