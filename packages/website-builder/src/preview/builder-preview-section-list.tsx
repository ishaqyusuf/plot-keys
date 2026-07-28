"use client";

import type {
  EditableFieldDefinition,
  SerializableSectionData,
} from "@plotkeys/section-registry";
import type { JSX } from "react";
import { PreviewSection } from "./builder-preview-section";

type Props = {
  configId: string;
  content: Record<string, string>;
  editableFields: EditableFieldDefinition[];
  familyOverrides: Record<
    string,
    (props: { config: unknown; theme: unknown }) => JSX.Element
  >;
  focusedSectionId: string | null;
  readOnly: boolean;
  sections: SerializableSectionData[];
  theme: Record<string, string>;
  onSectionFocus: (sectionId: string) => void;
  onSmartFill: (formData: FormData) => Promise<void>;
  onUpdate: (formData: FormData) => Promise<void>;
};

export function BuilderPreviewSectionList({
  configId,
  content,
  editableFields,
  familyOverrides,
  focusedSectionId,
  readOnly,
  sections,
  theme,
  onSectionFocus,
  onSmartFill,
  onUpdate,
}: Props) {
  return (
    <>
      {sections.map((section) => (
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
          onFocus={() => onSectionFocus(section.id)}
          onSmartFill={onSmartFill}
          onUpdate={onUpdate}
        />
      ))}
    </>
  );
}
