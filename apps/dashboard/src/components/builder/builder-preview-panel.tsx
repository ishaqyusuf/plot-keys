"use client";

import type {
  EditableFieldDefinition,
  SerializableSectionData,
  TenantContentRecord,
} from "@plotkeys/section-registry";
import {
  ClickGuardProvider,
  getRegisterTemplate,
  InlineOverview,
  resolveFamilySectionComponents,
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
import Link from "next/link";
import type { JSX, KeyboardEvent } from "react";
import { useState, useTransition } from "react";

type BuilderPreviewPanelProps = {
  companySlug: string;
  configId: string;
  defaultContent: TenantContentRecord;
  editableFields: EditableFieldDefinition[];
  pageKey: string;
  pageLabel: string;
  pageSlug: string;
  readOnly?: boolean;
  readOnlyMessage?: string;
  sections: SerializableSectionData[];
  templateKey?: string;
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
            className="absolute right-4 bottom-4 z-30 w-80 rounded-xl border border-border/70 bg-background/97 p-4 shadow-xl backdrop-blur"
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
  companySlug,
  configId,
  defaultContent,
  editableFields,
  pageKey,
  pageLabel,
  pageSlug,
  readOnly = false,
  readOnlyMessage,
  sections,
  templateKey,
  theme,
  visibleSections,
  onSmartFill,
  onUpdateField,
}: BuilderPreviewPanelProps) {
  const [focusedSectionId, setFocusedSectionId] = useState<string | null>(null);

  const familyOverrides = resolveFamilySectionComponents(
    getRegisterTemplate(templateKey ?? "")?.family,
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

  return (
    <div className="mx-auto overflow-hidden rounded-xl border border-border/70 bg-background shadow-[0_30px_70px_-35px_hsl(var(--foreground)/0.45)]">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-foreground/20" />
          <span className="size-2.5 rounded-full bg-foreground/20" />
          <span className="size-2.5 rounded-full bg-foreground/20" />
        </div>
        <div className="min-w-0 text-center">
          <p className="truncate text-xs uppercase tracking-[0.24em] text-muted-foreground">
            {companySlug}.plotkeys.app{pageSlug === "/" ? "" : pageSlug}
          </p>
          <p className="truncate text-[11px] text-muted-foreground/80">
            {pageLabel} · {pageKey}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{filteredSections.length} sections</Badge>
        </div>
      </div>

      {readOnly ? (
        <div className="flex flex-col gap-3 border-b border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-foreground md:flex-row md:items-center md:justify-between">
          <p>{readOnlyMessage ?? "Upgrade your plan to edit this template."}</p>
          <Button asChild size="sm" variant="outline">
            <Link href="/billing">Upgrade plan</Link>
          </Button>
        </div>
      ) : null}

      <div
        className="max-h-[78vh] overflow-auto bg-muted/20 p-3 md:p-4"
        role="presentation"
      >
        <WebsiteRuntimeProvider renderMode="draft">
          <ClickGuardProvider>
            <div
              className="overflow-hidden rounded-lg border border-border/70"
              style={{
                backgroundColor: "#f8fafc",
                fontFamily: "Satoshi, sans-serif",
              }}
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
        </WebsiteRuntimeProvider>
      </div>
    </div>
  );
}
