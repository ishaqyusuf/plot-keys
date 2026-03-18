"use client";

import type {
  EditableFieldDefinition,
  SerializableSectionData,
  TenantContentRecord,
} from "@plotkeys/section-registry";
import { sectionComponents, WebsiteRuntimeProvider } from "@plotkeys/section-registry";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { Textarea } from "@plotkeys/ui/textarea";
import type { JSX } from "react";
import { useState, useTransition } from "react";

type BuilderPreviewPanelProps = {
  companySlug: string;
  configId: string;
  defaultContent: TenantContentRecord;
  editableFields: EditableFieldDefinition[];
  sections: SerializableSectionData[];
  theme: Record<string, string>;
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
  onUpdate: (formData: FormData) => Promise<void>;
  onSmartFill: (formData: FormData) => Promise<void>;
};

function FieldEditor({
  configId,
  content,
  field,
  onUpdate,
  onSmartFill,
}: FieldEditorProps) {
  const [value, setValue] = useState(content[field.contentKey] ?? "");
  const [isPending, startTransition] = useTransition();
  const [isFilling, startFilling] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("configId", configId);
      fd.set("contentKey", field.contentKey);
      fd.set("value", value);
      await onUpdate(fd);
    });
  }

  function handleSmartFill() {
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
            disabled={isFilling}
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
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      ) : (
        <Input
          className="text-sm"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      )}
      <Button
        className="mt-1.5 w-full"
        disabled={isPending}
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
  focused: boolean;
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
  focused,
  section,
  theme,
  onFocus,
  onSmartFill,
  onUpdate,
}: PreviewSectionProps): JSX.Element {
  const SectionComponent = sectionComponents[section.type];
  const sectionFields = fieldsForSection(section.type, editableFields);

  return (
    <section
      className={[
        "group/section relative cursor-pointer",
        focused && "ring-2 ring-primary/40",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onFocus}
    >
      <div className="pointer-events-none absolute inset-x-5 top-5 z-20 flex items-center justify-between gap-3 opacity-0 transition-opacity duration-200 group-hover/section:opacity-100">
        <div className="rounded-md border border-border/80 bg-background/95 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground shadow-sm backdrop-blur">
          {sectionLabel(section.type)}
        </div>
        {sectionFields.length > 0 && (
          <div className="rounded-md border border-border/80 bg-background/95 px-3 py-1 text-xs text-foreground shadow-sm backdrop-blur">
            {focused ? "Editing" : "Click to edit →"}
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
          onClick={(e) => e.stopPropagation()}
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
                onSmartFill={onSmartFill}
                onUpdate={onUpdate}
              />
            ))}
          </FieldGroup>
        </div>
      )}
    </section>
  );
}

export function BuilderPreviewPanel({
  companySlug,
  configId,
  defaultContent,
  editableFields,
  sections,
  theme,
  onSmartFill,
  onUpdateField,
}: BuilderPreviewPanelProps) {
  const [focusedSectionId, setFocusedSectionId] = useState<string | null>(null);

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
        <p className="truncate text-xs uppercase tracking-[0.24em] text-muted-foreground">
          {companySlug}.plotkeys.app / builder-preview
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{sections.length} sections</Badge>
        </div>
      </div>

      <div
        className="max-h-[78vh] overflow-auto bg-muted/20 p-3 md:p-4"
        onClick={() => setFocusedSectionId(null)}
      >
        <WebsiteRuntimeProvider renderMode="draft">
          <div
            className="overflow-hidden rounded-lg border border-border/70"
            style={{ backgroundColor: "#f8fafc", fontFamily: "Satoshi, sans-serif" }}
          >
            {sections.map((section) => (
              <PreviewSection
                configId={configId}
                content={content}
                editableFields={editableFields}
                focused={focusedSectionId === section.id}
                key={section.id}
                section={section}
                theme={theme}
                onFocus={() => handleSectionFocus(section.id)}
                onSmartFill={onSmartFill}
                onUpdate={onUpdateField}
              />
            ))}
          </div>
        </WebsiteRuntimeProvider>
      </div>
    </div>
  );
}
