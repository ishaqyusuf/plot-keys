"use client";

import type {
  EditableFieldDefinition,
  RegistryLinkComponentProps,
  SerializableSectionData,
  TenantContentRecord,
  TemplateConfig,
  TemplateTier,
} from "@plotkeys/section-registry";
import {
  ClickGuardProvider,
  getRegisterFooterConfig,
  getRegisterNavConfig,
  getRegisterTemplate,
  InlineOverview,
  RegistryProvider,
  resolveRegisterSectionComponents,
  resolveTemplatePageHandle,
  SmartFillProvider,
  sectionComponents,
  WebsiteRuntimeProvider,
} from "@plotkeys/section-registry";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { Textarea } from "@plotkeys/ui/textarea";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { JSX, KeyboardEvent, MouseEvent } from "react";
import { useCallback, useState, useTransition } from "react";

type PageNavItem = {
  label: string;
  pageKey: string;
  slug: string;
};

type RegisterShellLinkHandler = (
  href: string,
  event: MouseEvent<HTMLAnchorElement>,
) => void;
type RegisterShellHrefResolver = (href: string) => string;

type BuilderPreviewPanelProps = {
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
  onUpdateField: (formData: FormData) => Promise<void>;
  onSmartFill: (formData: FormData) => Promise<void>;
};

function sectionLabel(type: string): string {
  const labels: Record<string, string> = {
    hero_banner: "Hero banner",
    market_stats: "Market stats",
    story_grid: "Story grid",
    listing_spotlight: "Listings spotlight",
    testimonial_strip: "Testimonials",
    cta_band: "CTA band",
    agent_showcase: "Agent showcase",
    property_grid: "Property grid",
    contact_section: "Contact",
  };

  return labels[type] ?? type;
}

function fieldsForSection(
  sectionType: string,
  allFields: EditableFieldDefinition[],
): EditableFieldDefinition[] {
  const prefixMap: Record<string, string[]> = {
    hero_banner: ["hero."],
    story_grid: ["story."],
    cta_band: ["cta."],
    contact_section: ["contact."],
  };

  const prefixes = prefixMap[sectionType];

  if (!prefixes) return [];

  return allFields.filter((f) =>
    prefixes.some((prefix) => f.contentKey.startsWith(prefix)),
  );
}

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function resolvePreviewRadiusClass(radius?: string) {
  if (radius === "none") return "rounded-none";
  if (radius === "sm") return "rounded-sm";
  if (radius === "md") return "rounded-md";
  if (radius === "lg") return "rounded-lg";
  if (radius === "xl") return "rounded-xl";
  if (radius === "full") return "rounded-full";

  return "rounded-md";
}

function resolvePreviewHeaderClass(templateConfig: TemplateConfig) {
  const base = "sticky top-0 z-30";

  if (templateConfig.menuStyle === "minimal") {
    return joinClasses(base, "bg-transparent");
  }

  if (templateConfig.menuStyle === "bordered") {
    return joinClasses(
      base,
      "border-b border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-card,#fff)]",
    );
  }

  if (templateConfig.menuStyle === "default-solid") {
    return joinClasses(
      base,
      "border-b border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#fff)]",
    );
  }

  return joinClasses(
    base,
    "border-b border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#fff)]/95 backdrop-blur",
  );
}

function resolvePreviewNavLinkClass(
  isActive: boolean,
  templateConfig: TemplateConfig,
) {
  const radius = resolvePreviewRadiusClass(templateConfig.radius);
  const base = joinClasses("px-3 py-1.5 text-sm transition-colors", radius);

  if (!isActive) {
    return joinClasses(
      base,
      "text-[color:var(--pk-muted-foreground,#64748b)] hover:bg-[color:var(--pk-muted,#f1f5f9)] hover:text-[color:var(--pk-foreground,#0f172a)]",
    );
  }

  if (templateConfig.menuAccent === "strong") {
    return joinClasses(
      base,
      "bg-[color:var(--pk-primary,#0f172a)] font-medium text-[color:var(--pk-primary-foreground,#fff)]",
    );
  }

  if (templateConfig.menuAccent === "none") {
    return joinClasses(
      base,
      "font-medium text-[color:var(--pk-foreground,#0f172a)] underline decoration-[color:var(--pk-primary,#0f172a)] decoration-2 underline-offset-8",
    );
  }

  return joinClasses(
    base,
    "bg-[color:var(--pk-primary,#0f172a)]/8 font-medium text-[color:var(--pk-primary,#0f172a)]",
  );
}

function resolvePreviewNavCtaClass(templateConfig: TemplateConfig) {
  const radius = resolvePreviewRadiusClass(templateConfig.radius);

  if (
    templateConfig.menuAccent === "none" ||
    templateConfig.menuStyle === "minimal"
  ) {
    return joinClasses(
      "border border-[color:var(--pk-border,#e2e8f0)] bg-transparent px-4 py-2 text-sm font-medium text-[color:var(--pk-foreground,#0f172a)] transition-colors hover:bg-[color:var(--pk-muted,#f1f5f9)]",
      radius,
    );
  }

  return joinClasses(
    "bg-[color:var(--pk-primary,#0f172a)] px-4 py-2 text-sm font-medium text-[color:var(--pk-primary-foreground,#fff)] transition-opacity hover:opacity-90",
    templateConfig.menuAccent === "strong" && "shadow-md shadow-black/10",
    radius,
  );
}

function PreviewRegisterShell({
  children,
  companyName,
  currentPath,
  templateConfig,
  templateKey,
  tier,
  onLinkClick,
  resolveLinkHref,
}: {
  children: JSX.Element;
  companyName: string;
  currentPath: string;
  templateConfig: TemplateConfig;
  templateKey: string;
  tier: TemplateTier;
  onLinkClick: RegisterShellLinkHandler;
  resolveLinkHref: RegisterShellHrefResolver;
}) {
  const nav = getRegisterNavConfig(templateKey, tier);
  const footer = getRegisterFooterConfig(templateKey);
  const year = new Date().getFullYear();

  return (
    <div className="min-h-full bg-[color:var(--pk-background,#fff)]">
      <header className={resolvePreviewHeaderClass(templateConfig)}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
          <a
            className="flex shrink-0 items-center gap-2.5 text-sm font-semibold text-[color:var(--pk-foreground,#0f172a)]"
            href={resolveLinkHref("/")}
            onClick={(event) => onLinkClick("/", event)}
          >
            <span className="text-base font-bold tracking-tight">
              {companyName}
            </span>
          </a>

          <nav
            aria-label="Template preview navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {nav.primary.map((link) => {
              const isActive = currentPath === link.href;

              return (
                <a
                  className={resolvePreviewNavLinkClass(
                    isActive,
                    templateConfig,
                  )}
                  href={resolveLinkHref(link.href)}
                  key={link.href}
                  onClick={(event) => onLinkClick(link.href, event)}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <a
            className={joinClasses(
              "hidden md:inline-flex",
              resolvePreviewNavCtaClass(templateConfig),
            )}
            href={resolveLinkHref(nav.ctaHref)}
            onClick={(event) => onLinkClick(nav.ctaHref, event)}
          >
            {nav.ctaLabel}
          </a>

          <details className="group relative md:hidden">
            <summary
              className={joinClasses(
                "flex cursor-pointer list-none items-center justify-center border border-[color:var(--pk-border,#e2e8f0)] p-2 text-[color:var(--pk-foreground,#0f172a)]",
                resolvePreviewRadiusClass(templateConfig.radius),
              )}
            >
              <Menu className="size-5 group-open:hidden" />
              <X className="hidden size-5 group-open:block" />
              <span className="sr-only">Toggle navigation</span>
            </summary>

            <div
              className={joinClasses(
                "absolute right-0 top-full mt-1 w-64 border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#fff)] p-2 shadow-lg",
                resolvePreviewRadiusClass(templateConfig.radius),
              )}
            >
              {nav.mobile.map((link) => {
                const isActive = currentPath === link.href;

                return (
                  <a
                    className={joinClasses(
                      "block py-2",
                      resolvePreviewNavLinkClass(isActive, templateConfig),
                    )}
                    href={resolveLinkHref(link.href)}
                    key={link.href}
                    onClick={(event) => onLinkClick(link.href, event)}
                  >
                    {link.label}
                  </a>
                );
              })}
              <div className="mt-2 border-t border-[color:var(--pk-border,#e2e8f0)] pt-2">
                <a
                  className={joinClasses(
                    "block px-3 py-2 text-center",
                    resolvePreviewNavCtaClass(templateConfig),
                  )}
                  href={resolveLinkHref(nav.ctaHref)}
                  onClick={(event) => onLinkClick(nav.ctaHref, event)}
                >
                  {nav.ctaLabel}
                </a>
              </div>
            </div>
          </details>
        </div>
      </header>

      {children}

      <footer className="border-t border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#fff)]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          {footer.groups.length > 0 ? (
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
              {footer.groups.map((group) => (
                <div key={group.heading}>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--pk-foreground,#0f172a)]">
                    {group.heading}
                  </p>
                  <ul className="space-y-2.5">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <a
                          className="text-sm text-[color:var(--pk-muted-foreground,#64748b)] transition-colors hover:text-[color:var(--pk-foreground,#0f172a)]"
                          href={resolveLinkHref(link.href)}
                          onClick={(event) => onLinkClick(link.href, event)}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
          <div
            className={joinClasses(
              "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
              footer.groups.length > 0 &&
                "mt-10 border-t border-[color:var(--pk-border,#e2e8f0)] pt-8",
            )}
          >
            <p className="text-sm text-[color:var(--pk-muted-foreground,#64748b)]">
              {footer.tagline}
            </p>
            <p className="shrink-0 text-xs text-[color:var(--pk-muted-foreground,#94a3b8)]">
              © {year} {companyName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

type FieldEditorProps = {
  configId: string;
  content: Record<string, string>;
  field: EditableFieldDefinition;
  readOnly?: boolean;
  onUpdate: (formData: FormData) => Promise<void>;
  onSmartFill: (formData: FormData) => Promise<void>;
};

function FieldEditor({
  configId,
  content,
  field,
  readOnly = false,
  onUpdate,
  onSmartFill,
}: FieldEditorProps) {
  const [value, setValue] = useState(content[field.contentKey] ?? "");
  const [isPending, startTransition] = useTransition();
  const [isFilling, startFilling] = useTransition();

  function handleSave() {
    if (readOnly) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("configId", configId);
      fd.set("contentKey", field.contentKey);
      fd.set("value", value);
      await onUpdate(fd);
    });
  }

  function handleSmartFill() {
    if (readOnly) return;
    startFilling(async () => {
      const fd = new FormData();
      fd.set("configId", configId);
      fd.set("contentKey", field.contentKey);
      fd.set("shortDetail", field.shortDetail);
      await onSmartFill(fd);
    });
  }

  return (
    <Field>
      <div className="flex items-center justify-between gap-2">
        <FieldLabel>{field.label}</FieldLabel>
        {field.aiEnabled && (
          <Button
            className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
            disabled={readOnly || isFilling}
            onClick={handleSmartFill}
            size="sm"
            type="button"
            variant="ghost"
          >
            {isFilling ? "Filling…" : "AI fill"}
          </Button>
        )}
      </div>
      <FieldDescription>{field.shortDetail}</FieldDescription>
      {field.fieldType === "textarea" ? (
        <Textarea
          className="min-h-[5rem] resize-none text-sm"
          disabled={readOnly}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      ) : (
        <Input
          className="text-sm"
          disabled={readOnly}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      )}
      <Button
        className="mt-1.5 w-full"
        disabled={readOnly || isPending}
        onClick={handleSave}
        size="sm"
        type="button"
        variant="secondary"
      >
        {isPending ? "Saving…" : "Save"}
      </Button>
    </Field>
  );
}

type PreviewSectionProps = {
  configId: string;
  content: Record<string, string>;
  editableFields: EditableFieldDefinition[];
  familyOverrides: Record<
    string,
    (props: { config: unknown; theme: unknown }) => JSX.Element
  >;
  focused: boolean;
  readOnly?: boolean;
  section: SerializableSectionData;
  theme: Record<string, string>;
  onFocus: () => void;
  onSmartFill: (formData: FormData) => Promise<void>;
  onUpdate: (formData: FormData) => Promise<void>;
};

function PreviewSection({
  configId,
  content,
  editableFields,
  familyOverrides,
  focused,
  readOnly = false,
  section,
  theme,
  onFocus,
  onSmartFill,
  onUpdate,
}: PreviewSectionProps): JSX.Element {
  const SectionComponent =
    familyOverrides[section.type] ?? sectionComponents[section.type];
  const sectionFields = fieldsForSection(section.type, editableFields);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (readOnly) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onFocus();
    }
  }

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: builder preview sections use a lightweight wrapper to focus inline editors without changing section layout. */}
      <div
        aria-disabled={readOnly}
        className={[
          "group/section relative",
          readOnly ? "cursor-not-allowed" : "cursor-pointer",
          focused && "ring-2 ring-primary/40",
        ]
          .filter(Boolean)
          .join(" ")}
        onKeyDown={readOnly ? undefined : handleKeyDown}
        onClick={readOnly ? undefined : onFocus}
        role={readOnly ? "presentation" : "button"}
        tabIndex={readOnly ? -1 : 0}
      >
        <div className="pointer-events-none absolute inset-x-5 top-5 z-20 flex items-center justify-between gap-3 opacity-0 transition-opacity duration-200 group-hover/section:opacity-100">
          <div className="rounded-md border border-border/80 bg-background/95 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground shadow-sm backdrop-blur">
            {sectionLabel(section.type)}
          </div>
          {sectionFields.length > 0 && (
            <div className="rounded-md border border-border/80 bg-background/95 px-3 py-1 text-xs text-foreground shadow-sm backdrop-blur">
              {readOnly
                ? "Upgrade to edit"
                : focused
                  ? "Editing"
                  : "Click to edit →"}
            </div>
          )}
        </div>
        <div
          className={[
            "transition-all duration-200",
            focused
              ? "ring-2 ring-inset ring-primary/30"
              : "group-hover/section:ring-1 group-hover/section:ring-primary/25",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {SectionComponent ? (
            <SectionComponent config={section.config} theme={theme as never} />
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-muted-foreground">
              Unknown section type: {section.type}
            </div>
          )}
        </div>
        {focused && sectionFields.length > 0 && (
          <div
            className="absolute right-4 bottom-4 z-30 w-80 rounded-[1.1rem] border border-border/70 bg-card/96 p-4 shadow-[var(--shadow-card)] backdrop-blur"
            role="presentation"
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {sectionLabel(section.type)} fields
            </p>
            <FieldGroup className="space-y-4">
              {sectionFields.map((field) => (
                <FieldEditor
                  configId={configId}
                  content={content}
                  field={field}
                  key={field.contentKey}
                  readOnly={readOnly}
                  onSmartFill={onSmartFill}
                  onUpdate={onUpdate}
                />
              ))}
            </FieldGroup>
          </div>
        )}
      </div>
    </>
  );
}

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
}: BuilderPreviewPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [focusedSectionId, setFocusedSectionId] = useState<string | null>(null);

  function normalizeInternalHrefPath(href: string) {
    if (!href || href.startsWith("#")) return null;
    if (/^(mailto|tel|sms|javascript):/i.test(href)) return null;

    try {
      const url = new URL(href, "http://registry.local");
      if (url.origin !== "http://registry.local") return null;
      return url.pathname || "/";
    } catch {
      return null;
    }
  }

  function resolvePreviewPage(href: string, pageKey?: string) {
    const hrefPath = normalizeInternalHrefPath(href);
    const hrefPage = hrefPath
      ? availablePages?.find((page) => page.slug === hrefPath)
      : undefined;

    if (hrefPage) return hrefPage;
    if (!pageKey || pageKey === activePageKey) return null;

    return availablePages?.find((page) => page.pageKey === pageKey) ?? null;
  }

  function buildPreviewPageHref(page: PageNavItem) {
    const params = new URLSearchParams(searchParams.toString());

    if (page.slug === "/" || page.pageKey === "home") {
      params.delete("page");
      params.delete("path");
    } else {
      params.set("page", page.pageKey);
      params.set("path", page.slug);
    }

    const query = params.toString();
    return query ? `?${query}` : "?";
  }

  function resolvePreviewLinkHref(href: string, pageKey?: string) {
    if (registryLinkMode !== "page-query") return href;

    const targetPage = resolvePreviewPage(href, pageKey);
    return targetPage ? buildPreviewPageHref(targetPage) : href;
  }

  function handlePageNav(page: PageNavItem) {
    const params = new URLSearchParams(window.location.search);
    if (page.slug === "/" || page.pageKey === "home") {
      params.delete("page");
      params.delete("path");
    } else {
      params.set("page", page.pageKey);
      params.set("path", page.slug);
    }
    router.push(`?${params.toString()}`);
  }

  function handlePreviewLinkClick(
    href: string,
    event: MouseEvent<HTMLAnchorElement>,
    pageKey?: string,
  ) {
    const targetPage = resolvePreviewPage(href, pageKey);
    if (!targetPage) return;

    event.preventDefault();
    handlePageNav(targetPage);
  }

  function PreviewRegistryLink({
    children,
    href,
    onClick,
    page,
    ...props
  }: RegistryLinkComponentProps) {
    const resolvedHref = resolvePreviewLinkHref(href, page);

    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handlePreviewLinkClick(href, event, page);
    }

    return (
      <a href={resolvedHref} {...props} onClick={handleClick}>
        {children}
      </a>
    );
  }

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
  const TemplatePage = templatePageHandle?.Page;

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

  function handleSectionFocus(sectionId: string) {
    setFocusedSectionId((prev) => (prev === sectionId ? null : sectionId));
  }

  // Bridges the inline AI button in EditableText to the smartFillField mutation.
  // Derives shortDetail from the contentKey (e.g. "hero.title" → "hero title").
  const handleInlineSmartFill = useCallback(
    async (contentKey: string) => {
      const fd = new FormData();
      fd.set("configId", configId);
      fd.set("contentKey", contentKey);
      fd.set(
        "shortDetail",
        contentKey
          .replace(/\./g, " ")
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .toLowerCase(),
      );
      await onSmartFill(fd);
    },
    [configId, onSmartFill],
  );

  const handleInlineContentCommit = useCallback(
    async (contentKey: string, value: string) => {
      const fd = new FormData();
      fd.set("configId", configId);
      fd.set("contentKey", contentKey);
      fd.set("value", value);
      await onUpdateField(fd);
    },
    [configId, onUpdateField],
  );

  const isCanvas = presentation === "canvas";
  const showPreviewChrome = !isCanvas;
  const previewBodyClassName = isCanvas
    ? "min-h-full bg-[color:var(--pk-background,var(--background))]"
    : "overflow-hidden rounded-[1.15rem] border border-border/70 bg-background/96";
  const previewBodyStyle = {
    backgroundColor: "var(--pk-background, var(--background))",
    fontFamily: "var(--pk-font-body, Satoshi, sans-serif)",
  };
  const renderedTemplatePage = TemplatePage ? (
    registerTemplate ? (
      <PreviewRegisterShell
        companyName={companyName}
        currentPath={pageSlug}
        templateConfig={templateConfig}
        templateKey={registerTemplate.key}
        tier={registerTemplate.tier}
        onLinkClick={handlePreviewLinkClick}
        resolveLinkHref={resolvePreviewLinkHref}
      >
        <TemplatePage />
      </PreviewRegisterShell>
    ) : (
      <TemplatePage />
    )
  ) : null;

  return (
    <div
      className={
        isCanvas
          ? "flex h-full min-h-0 flex-col overflow-hidden bg-background"
          : "mx-auto overflow-hidden rounded-[1.35rem] border border-border/70 bg-card/86 shadow-[var(--shadow-card)] backdrop-blur-sm"
      }
    >
      {showPreviewChrome ? (
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-background/88 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-foreground/18" />
            <span className="size-2.5 rounded-full bg-foreground/18" />
            <span className="size-2.5 rounded-full bg-foreground/18" />
          </div>
          {availablePages && availablePages.length > 1 ? (
            <div className="min-w-0 flex-1 text-center">
              <nav className="flex min-w-0 items-center justify-center gap-1 overflow-x-auto">
                {availablePages.map((page) => (
                  <button
                    className={[
                      "shrink-0 rounded-full border px-3 py-1 text-xs transition-colors",
                      activePageKey === page.pageKey
                        ? "border-primary/20 bg-primary/10 font-medium text-primary"
                        : "border-transparent text-muted-foreground hover:border-border/70 hover:bg-background/80 hover:text-foreground",
                    ].join(" ")}
                    key={page.pageKey}
                    type="button"
                    onClick={() => handlePageNav(page)}
                  >
                    {page.label}
                  </button>
                ))}
              </nav>
              <p className="mt-1 truncate text-[11px] text-muted-foreground/80">
                {companySlug}.plotkeys.app{pageSlug === "/" ? "" : pageSlug}
              </p>
            </div>
          ) : (
            <div className="min-w-0 text-center">
              <p className="truncate text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {companySlug}.plotkeys.app{pageSlug === "/" ? "" : pageSlug}
              </p>
              <p className="truncate text-[11px] text-muted-foreground/80">
                {pageLabel} · {pageKey}
              </p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {TemplatePage
                ? "Page component"
                : `${filteredSections.length} sections`}
            </Badge>
          </div>
        </div>
      ) : null}

      {readOnly ? (
        <div className="flex flex-col gap-3 border-b border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-foreground md:flex-row md:items-center md:justify-between">
          <p>{readOnlyMessage ?? "Upgrade your plan to edit this template."}</p>
          <Button asChild size="sm" variant="outline">
            <Link href="/billing">Upgrade plan</Link>
          </Button>
        </div>
      ) : null}

      <div
        className={
          isCanvas
            ? "min-h-0 flex-1 overflow-auto bg-background"
            : "max-h-[78vh] overflow-auto bg-muted/12 p-3 md:p-4"
        }
        data-template-preview-scroll=""
        role="presentation"
      >
        {TemplatePage ? (
          <RegistryProvider
            colorSystemKey={templateConfig.colorSystem}
            content={defaultContent}
            linkComponent={PreviewRegistryLink}
            onContentCommit={readOnly ? undefined : handleInlineContentCommit}
            pageInfo={templatePageHandle?.info}
            renderMode="draft"
            sections={filteredSections}
            templateConfig={templateConfig}
            templateKey={templateKey}
            tenant={{
              companyName,
              subdomain: companySlug,
            }}
          >
            {readOnly ? (
              <ClickGuardProvider>
                <div
                  className={previewBodyClassName}
                  style={previewBodyStyle}
                >
                  {renderedTemplatePage}
                </div>
                <InlineOverview />
              </ClickGuardProvider>
            ) : (
              <SmartFillProvider onSmartFill={handleInlineSmartFill}>
                <ClickGuardProvider>
                  <div
                    className={previewBodyClassName}
                    style={previewBodyStyle}
                  >
                    {renderedTemplatePage}
                  </div>
                  <InlineOverview />
                </ClickGuardProvider>
              </SmartFillProvider>
            )}
          </RegistryProvider>
        ) : (
          <WebsiteRuntimeProvider
            renderMode="draft"
            templateConfig={templateConfig}
          >
            {/* SmartFillProvider only in editable mode — suppressed for locked templates */}
            {readOnly ? (
              <ClickGuardProvider>
                <div
                  className={previewBodyClassName}
                  style={previewBodyStyle}
                >
                  {filteredSections.map((section) => (
                    <PreviewSection
                      configId={configId}
                      content={content}
                      editableFields={editableFields}
                      familyOverrides={familyOverrides}
                      focused={focusedSectionId === section.id}
                      key={section.id}
                      readOnly={readOnly}
                      section={section}
                      theme={theme}
                      onFocus={() => handleSectionFocus(section.id)}
                      onSmartFill={onSmartFill}
                      onUpdate={onUpdateField}
                    />
                  ))}
                </div>
                <InlineOverview />
              </ClickGuardProvider>
            ) : (
              <SmartFillProvider onSmartFill={handleInlineSmartFill}>
                <ClickGuardProvider>
                  <div
                    className={previewBodyClassName}
                    style={previewBodyStyle}
                  >
                    {filteredSections.map((section) => (
                      <PreviewSection
                        configId={configId}
                        content={content}
                        editableFields={editableFields}
                        familyOverrides={familyOverrides}
                        focused={focusedSectionId === section.id}
                        key={section.id}
                        readOnly={readOnly}
                        section={section}
                        theme={theme}
                        onFocus={() => handleSectionFocus(section.id)}
                        onSmartFill={onSmartFill}
                        onUpdate={onUpdateField}
                      />
                    ))}
                  </div>
                  <InlineOverview />
                </ClickGuardProvider>
              </SmartFillProvider>
            )}
          </WebsiteRuntimeProvider>
        )}
      </div>
    </div>
  );
}
