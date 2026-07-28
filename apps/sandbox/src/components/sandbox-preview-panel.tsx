"use client";

import type {
  EditableFieldDefinition,
  RegistryLinkComponentProps,
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
import { useRouter, useSearchParams } from "next/navigation";
import { type MouseEvent, useCallback, useState } from "react";

type PageNavItem = {
  label: string;
  pageKey: string;
  slug: string;
};

type Props = {
  availablePages: PageNavItem[];
  companyName: string;
  companySlug: string;
  configId: string;
  defaultContent: TenantContentRecord;
  editableFields: EditableFieldDefinition[];
  pageKey: string;
  pageLabel: string;
  pageSlug: string;
  sections: SerializableSectionData[];
  templateKey: string;
  templateConfig: TemplateConfig;
  theme: Record<string, string>;
  visibleSections?: Record<string, boolean>;
  onUpdateField: (formData: FormData) => Promise<void>;
  onSmartFill: (formData: FormData) => Promise<void>;
};

function internalPath(href: string) {
  if (!href || href.startsWith("#")) return null;
  if (/^(mailto|tel|sms|javascript):/i.test(href)) return null;

  try {
    const url = new URL(href, "http://sandbox.local");
    return url.origin === "http://sandbox.local" ? url.pathname || "/" : null;
  } catch {
    return null;
  }
}

function pageMatchesPath(page: PageNavItem, pathname: string) {
  if (!page.slug.includes("[slug]")) return page.slug === pathname;
  const [prefix, suffix = ""] = page.slug.split("[slug]");
  return (
    pathname.startsWith(prefix ?? "") &&
    pathname.endsWith(suffix) &&
    pathname.slice((prefix ?? "").length, suffix ? -suffix.length : undefined)
      .length > 0
  );
}

export function SandboxPreviewPanel({
  availablePages,
  companyName,
  companySlug,
  configId,
  defaultContent,
  editableFields,
  pageKey,
  pageSlug,
  sections,
  templateKey,
  templateConfig,
  theme,
  visibleSections,
  onSmartFill,
  onUpdateField,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [focusedSectionId, setFocusedSectionId] = useState<string | null>(null);

  const resolvePage = useCallback(
    (href: string, targetPageKey?: string) => {
      const pathname = internalPath(href);
      if (pathname) {
        const matchingPage = availablePages.find((page) =>
          pageMatchesPath(page, pathname),
        );
        if (matchingPage) return matchingPage;
      }

      return targetPageKey
        ? (availablePages.find((page) => page.pageKey === targetPageKey) ??
            null)
        : null;
    },
    [availablePages],
  );

  const hrefForPage = useCallback(
    (page: PageNavItem, rawPath?: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page.pageKey === "home" || page.slug === "/") {
        params.delete("page");
        params.delete("path");
      } else {
        params.set("page", page.pageKey);
        params.set("path", rawPath ?? page.slug);
      }
      const query = params.toString();
      return query ? `?${query}` : "?";
    },
    [searchParams],
  );

  const resolveLinkHref = useCallback(
    (href: string, targetPageKey?: string) => {
      const page = resolvePage(href, targetPageKey);
      return page ? hrefForPage(page, internalPath(href)) : href;
    },
    [hrefForPage, resolvePage],
  );

  const handleLinkClick = useCallback(
    (
      href: string,
      event: MouseEvent<HTMLAnchorElement>,
      targetPageKey?: string,
    ) => {
      const page = resolvePage(href, targetPageKey);
      if (!page) return;
      event.preventDefault();
      router.push(hrefForPage(page, internalPath(href)));
    },
    [hrefForPage, resolvePage, router],
  );

  function PreviewRegistryLink({
    children,
    href,
    onClick,
    page,
    ...props
  }: RegistryLinkComponentProps) {
    return (
      <a
        href={resolveLinkHref(href, page)}
        {...props}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) handleLinkClick(href, event, page);
        }}
      >
        {children}
      </a>
    );
  }

  const presentation = useBuilderPreviewPresentation({
    companyName,
    defaultContent,
    editableFields,
    onLinkClick: (href, event) => handleLinkClick(href, event),
    pageKey,
    pageSlug,
    resolveLinkHref,
    sections,
    templateConfig,
    templateKey,
    visibleSections,
  });

  async function run(
    action: (formData: FormData) => Promise<void>,
    formData: FormData,
  ) {
    setErrorMessage(null);
    try {
      await action(formData);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update the preview.",
      );
      throw error;
    }
  }

  async function updateInline(contentKey: string, value: string) {
    const formData = new FormData();
    formData.set("configId", configId);
    formData.set("contentKey", contentKey);
    formData.set("value", value);
    await run(onUpdateField, formData);
  }

  async function smartFillInline(contentKey: string) {
    const formData = new FormData();
    formData.set("configId", configId);
    formData.set("contentKey", contentKey);
    formData.set("shortDetail", contentKey.replace(/\./g, " "));
    await run(onSmartFill, formData);
  }

  return (
    <BuilderPreviewShell isCanvas>
      {errorMessage ? (
        <Alert className="border-x-0 border-t-0" variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}
      <BuilderPreviewRuntimeBody
        companyName={companyName}
        companySlug={companySlug}
        configId={configId}
        content={presentation.content}
        defaultContent={defaultContent}
        editableFields={editableFields}
        familyOverrides={presentation.familyOverrides}
        filteredSections={presentation.filteredSections}
        focusedSectionId={focusedSectionId}
        isCanvas
        linkComponent={PreviewRegistryLink}
        pageInfo={presentation.pageInfo}
        readOnly={false}
        renderedTemplatePage={presentation.renderedTemplatePage}
        templateConfig={templateConfig}
        templateKey={templateKey}
        theme={theme}
        onInlineContentCommit={updateInline}
        onInlineSmartFill={smartFillInline}
        onSectionFocus={(sectionId) =>
          setFocusedSectionId((current) =>
            current === sectionId ? null : sectionId,
          )
        }
        onSmartFill={(formData) => run(onSmartFill, formData)}
        onUpdate={(formData) => run(onUpdateField, formData)}
      />
    </BuilderPreviewShell>
  );
}
