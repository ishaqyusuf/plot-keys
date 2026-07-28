"use client";

import type {
  EditableFieldDefinition,
  SerializableSectionData,
} from "@plotkeys/section-registry";
import { sectionComponents } from "@plotkeys/section-registry";
import { cn } from "@plotkeys/ui/cn";
import { FieldGroup } from "@plotkeys/ui/field";
import type { JSX, KeyboardEvent } from "react";
import { BuilderPreviewFieldEditor } from "./builder-preview-field-editor";
import {
  getBuilderPreviewSectionFields,
  getBuilderPreviewSectionLabel,
} from "./builder-preview-section-fields";

type Props = {
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

export function PreviewSection({
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
}: Props): JSX.Element {
  const SectionComponent =
    familyOverrides[section.type] ?? sectionComponents[section.type];
  const sectionFields = getBuilderPreviewSectionFields(
    section.type,
    editableFields,
  );
  const sectionLabel = getBuilderPreviewSectionLabel(section.type);

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
        className={cn(
          "group/section relative",
          readOnly ? "cursor-not-allowed" : "cursor-pointer",
          focused && "ring-2 ring-primary/40",
        )}
        onClick={readOnly ? undefined : onFocus}
        onKeyDown={readOnly ? undefined : handleKeyDown}
        role={readOnly ? "presentation" : "button"}
        tabIndex={readOnly ? -1 : 0}
      >
        <div className="pointer-events-none absolute inset-x-5 top-5 z-20 flex items-center justify-between gap-3 opacity-0 transition-opacity duration-200 group-hover/section:opacity-100">
          <div className="border border-border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground">
            {sectionLabel}
          </div>
          {sectionFields.length > 0 && (
            <div className="border border-border bg-background px-3 py-1 text-xs text-foreground">
              {readOnly
                ? "Upgrade to edit"
                : focused
                  ? "Editing"
                  : "Click to edit"}
            </div>
          )}
        </div>
        <div
          className={cn(
            "transition-all duration-200",
            focused
              ? "ring-2 ring-inset ring-primary/30"
              : "group-hover/section:ring-1 group-hover/section:ring-primary/25",
          )}
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
            className="absolute right-4 bottom-4 z-30 w-80 border border-border bg-background p-4"
            role="presentation"
          >
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              {sectionLabel} fields
            </p>
            <FieldGroup className="space-y-4">
              {sectionFields.map((field) => (
                <BuilderPreviewFieldEditor
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
