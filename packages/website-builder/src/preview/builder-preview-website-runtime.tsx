"use client";

import type {
  EditableFieldDefinition,
  SerializableSectionData,
  TemplateConfig,
} from "@plotkeys/section-registry";
import { WebsiteRuntimeProvider } from "@plotkeys/section-registry";
import type { CSSProperties, JSX } from "react";
import { BuilderPreviewGuardedFrame } from "./builder-preview-guarded-frame";
import { BuilderPreviewSectionList } from "./builder-preview-section-list";

type Props = {
  configId: string;
  content: Record<string, string>;
  editableFields: EditableFieldDefinition[];
  familyOverrides: Record<
    string,
    (props: { config: unknown; theme: unknown }) => JSX.Element
  >;
  focusedSectionId: string | null;
  frameClassName: string;
  frameStyle: CSSProperties;
  readOnly: boolean;
  sections: SerializableSectionData[];
  templateConfig: TemplateConfig;
  theme: Record<string, string>;
  onInlineSmartFill: (contentKey: string) => Promise<void>;
  onSectionFocus: (sectionId: string) => void;
  onSmartFill: (formData: FormData) => Promise<void>;
  onUpdate: (formData: FormData) => Promise<void>;
};

export function BuilderPreviewWebsiteRuntime({
  configId,
  content,
  editableFields,
  familyOverrides,
  focusedSectionId,
  frameClassName,
  frameStyle,
  readOnly,
  sections,
  templateConfig,
  theme,
  onInlineSmartFill,
  onSectionFocus,
  onSmartFill,
  onUpdate,
}: Props) {
  return (
    <WebsiteRuntimeProvider renderMode="draft" templateConfig={templateConfig}>
      <BuilderPreviewGuardedFrame
        className={frameClassName}
        onSmartFill={onInlineSmartFill}
        readOnly={readOnly}
        style={frameStyle}
      >
        <BuilderPreviewSectionList
          configId={configId}
          content={content}
          editableFields={editableFields}
          familyOverrides={familyOverrides}
          focusedSectionId={focusedSectionId}
          readOnly={readOnly}
          sections={sections}
          theme={theme}
          onSectionFocus={onSectionFocus}
          onSmartFill={onSmartFill}
          onUpdate={onUpdate}
        />
      </BuilderPreviewGuardedFrame>
    </WebsiteRuntimeProvider>
  );
}
