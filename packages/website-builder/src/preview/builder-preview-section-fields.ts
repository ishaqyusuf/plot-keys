import type { EditableFieldDefinition } from "@plotkeys/section-registry";
import { getBuilderSectionLabel } from "./builder-section-labels";

const sectionFieldPrefixes: Record<string, string[]> = {
  contact_section: ["contact."],
  cta_band: ["cta."],
  hero_banner: ["hero."],
  story_grid: ["story."],
};

export function getBuilderPreviewSectionLabel(type: string): string {
  return getBuilderSectionLabel(type);
}

export function getBuilderPreviewSectionFields(
  sectionType: string,
  allFields: EditableFieldDefinition[],
): EditableFieldDefinition[] {
  const prefixes = sectionFieldPrefixes[sectionType];

  if (!prefixes) return [];

  return allFields.filter((field) =>
    prefixes.some((prefix) => field.contentKey.startsWith(prefix)),
  );
}
