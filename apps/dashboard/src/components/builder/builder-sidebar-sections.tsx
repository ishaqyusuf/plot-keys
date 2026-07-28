"use client";

import { Input } from "@plotkeys/ui/input";
import { Switch } from "@plotkeys/ui/switch";
import { Textarea } from "@plotkeys/ui/textarea";
import { getBuilderSectionLabel } from "@plotkeys/website-builder";
import {
  BuilderSidebarField,
  BuilderSidebarSectionGroup,
} from "./builder-sidebar-section-group";
import {
  type SaveBuilderSidebarThemeField,
  useBuilderSidebarNamedImageValues,
  useBuilderSidebarSectionVisibility,
  useBuilderSidebarSeoValues,
} from "./use-builder-sidebar-section-fields";

type ImageSlotsInput = {
  configId: string;
  disabled?: boolean;
  namedImageSlots: Record<string, string>;
  namedImages?: Record<string, string>;
  onSave: SaveBuilderSidebarThemeField;
};

type SectionVisibilityInput = {
  configId: string;
  disabled?: boolean;
  onSave: SaveBuilderSidebarThemeField;
  sectionTypes: string[];
  visibleSections?: Record<string, boolean>;
};

type SeoInput = {
  configId: string;
  disabled?: boolean;
  onSave: SaveBuilderSidebarThemeField;
  pageKey: string;
  seoValues?: { title?: string; description?: string; ogImage?: string };
};

export function ImageSlotsSection({
  configId,
  disabled = false,
  namedImageSlots,
  namedImages,
  onSave,
}: ImageSlotsInput) {
  const { handleChange, slots, values } = useBuilderSidebarNamedImageValues({
    configId,
    disabled,
    namedImages,
    namedImageSlots,
    onSave,
  });

  if (slots.length === 0) return null;

  return (
    <BuilderSidebarSectionGroup title="Images">
      {slots.map((slot) => (
        <BuilderSidebarField
          key={slot}
          label={slot.replace(/([A-Z])/g, " $1").trim()}
          labelClassName="text-xs capitalize text-muted-foreground"
        >
          <Input
            className="mt-0.5 text-xs"
            disabled={disabled}
            onChange={(e) => handleChange(slot, e.target.value)}
            placeholder="Paste image URL..."
            value={values[slot] ?? ""}
          />
        </BuilderSidebarField>
      ))}
    </BuilderSidebarSectionGroup>
  );
}

export function SectionVisibilityToggles({
  configId,
  disabled = false,
  onSave,
  sectionTypes,
  visibleSections,
}: SectionVisibilityInput) {
  const { handleToggle, visibility } = useBuilderSidebarSectionVisibility({
    configId,
    disabled,
    onSave,
    sectionTypes,
    visibleSections,
  });

  if (sectionTypes.length === 0) return null;

  return (
    <BuilderSidebarSectionGroup title="Sections">
      {sectionTypes.map((type) => (
        <div className="flex items-center justify-between gap-2" key={type}>
          <span className="text-xs text-foreground">
            {getBuilderSectionLabel(type)}
          </span>
          <Switch
            checked={visibility[type] !== false}
            disabled={disabled}
            onCheckedChange={(checked) => handleToggle(type, checked)}
          />
        </div>
      ))}
    </BuilderSidebarSectionGroup>
  );
}

export function SeoSection({
  configId,
  disabled = false,
  onSave,
  pageKey,
  seoValues,
}: SeoInput) {
  const { handleChange, values } = useBuilderSidebarSeoValues({
    configId,
    disabled,
    onSave,
    pageKey,
    seoValues,
  });

  return (
    <BuilderSidebarSectionGroup title="SEO">
      <BuilderSidebarField label="Page title">
        <Input
          className="mt-0.5 text-xs"
          disabled={disabled}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Override page title..."
          value={values.title}
        />
      </BuilderSidebarField>
      <BuilderSidebarField label="Meta description">
        <Textarea
          className="mt-0.5 min-h-0 resize-none text-xs"
          disabled={disabled}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Describe this page for search engines..."
          rows={3}
          value={values.description}
        />
      </BuilderSidebarField>
      <BuilderSidebarField label="OG image URL">
        <Input
          className="mt-0.5 text-xs"
          disabled={disabled}
          onChange={(e) => handleChange("ogImage", e.target.value)}
          placeholder="Paste image URL for social sharing..."
          value={values.ogImage}
        />
      </BuilderSidebarField>
    </BuilderSidebarSectionGroup>
  );
}
