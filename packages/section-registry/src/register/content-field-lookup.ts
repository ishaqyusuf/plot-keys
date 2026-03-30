import { banaContentSchema } from "./bana/common/content-schema";
import { farisContentSchema } from "./faris/common/content-schema";
import { noorContentSchema } from "./noor/common/content-schema";
import { sakanContentSchema } from "./sakan/common/content-schema";
import { thurayaContentSchema } from "./thuraya/common/content-schema";
import type { ContentFieldDef } from "./types";
import { wafiContentSchema } from "./wafi/common/content-schema";

const sharedContentFields: ContentFieldDef[] = [
  {
    aiEnabled: true,
    contentKey: "hero.eyebrow",
    defaultValue: "",
    label: "Hero eyebrow",
    placeholderValue: "",
  },
  {
    aiEnabled: true,
    contentKey: "hero.title",
    defaultValue: "",
    label: "Hero title",
    placeholderValue: "",
  },
  {
    aiEnabled: true,
    contentKey: "hero.subtitle",
    defaultValue: "",
    label: "Hero subtitle",
    placeholderValue: "",
  },
  {
    aiEnabled: true,
    contentKey: "hero.ctaText",
    defaultValue: "",
    label: "Hero CTA",
    placeholderValue: "",
  },
  {
    aiEnabled: true,
    contentKey: "story.title",
    defaultValue: "",
    label: "Story title",
    placeholderValue: "",
  },
  {
    aiEnabled: true,
    contentKey: "story.description",
    defaultValue: "",
    label: "Story description",
    placeholderValue: "",
  },
  {
    aiEnabled: true,
    contentKey: "cta.title",
    defaultValue: "",
    label: "CTA title",
    placeholderValue: "",
  },
  {
    aiEnabled: true,
    contentKey: "cta.body",
    defaultValue: "",
    label: "CTA body",
    placeholderValue: "",
  },
];

const allContentSchemas = [
  ...sharedContentFields,
  ...noorContentSchema,
  ...banaContentSchema,
  ...wafiContentSchema,
  ...farisContentSchema,
  ...thurayaContentSchema,
  ...sakanContentSchema,
];

const contentFieldLookup = new Map<string, ContentFieldDef>();

for (const field of allContentSchemas) {
  const existing = contentFieldLookup.get(field.contentKey);

  if (!existing) {
    contentFieldLookup.set(field.contentKey, field);
    continue;
  }

  if (field.aiEnabled && !existing.aiEnabled) {
    contentFieldLookup.set(field.contentKey, {
      ...existing,
      aiEnabled: true,
    });
  }
}

export function getContentFieldDefinition(
  contentKey: string,
): ContentFieldDef | undefined {
  return contentFieldLookup.get(contentKey);
}

export function isContentKeyAiEnabled(contentKey: string): boolean {
  return getContentFieldDefinition(contentKey)?.aiEnabled ?? false;
}
