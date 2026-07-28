"use client";

import { useRef, useState, useTransition } from "react";

export type SaveBuilderSidebarThemeField = (
  formData: FormData,
) => Promise<void>;

type UseBuilderSidebarNamedImageValuesOptions = {
  configId: string;
  disabled?: boolean;
  namedImageSlots: Record<string, string>;
  namedImages?: Record<string, string>;
  onSave: SaveBuilderSidebarThemeField;
};

type UseBuilderSidebarSectionVisibilityOptions = {
  configId: string;
  disabled?: boolean;
  onSave: SaveBuilderSidebarThemeField;
  sectionTypes: string[];
  visibleSections?: Record<string, boolean>;
};

type SeoField = "title" | "description" | "ogImage";

type UseBuilderSidebarSeoValuesOptions = {
  configId: string;
  disabled?: boolean;
  onSave: SaveBuilderSidebarThemeField;
  pageKey: string;
  seoValues?: { title?: string; description?: string; ogImage?: string };
};

function createThemeFieldFormData({
  configId,
  themeKey,
  value,
}: {
  configId: string;
  themeKey: string;
  value: string;
}) {
  const fd = new FormData();
  fd.set("configId", configId);
  fd.set("themeKey", themeKey);
  fd.set("value", value);
  return fd;
}

export function useBuilderSidebarNamedImageValues({
  configId,
  disabled = false,
  namedImageSlots,
  namedImages,
  onSave,
}: UseBuilderSidebarNamedImageValuesOptions) {
  const slots = Object.keys(namedImageSlots);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(
      slots.map((slot) => [
        slot,
        namedImages?.[slot] ?? namedImageSlots[slot] ?? "",
      ]),
    ),
  );
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(slot: string, url: string) {
    if (disabled) return;

    setValues((prev) => ({ ...prev, [slot]: url }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        await onSave(
          createThemeFieldFormData({
            configId,
            themeKey: `namedImage.${slot}`,
            value: url.trim(),
          }),
        );
      });
    }, 600);
  }

  return {
    handleChange,
    slots,
    values,
  };
}

export function useBuilderSidebarSectionVisibility({
  configId,
  disabled = false,
  onSave,
  sectionTypes,
  visibleSections,
}: UseBuilderSidebarSectionVisibilityOptions) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const type of sectionTypes) {
      initial[type] = visibleSections?.[type] !== false;
    }
    return initial;
  });
  const [, startTransition] = useTransition();

  function handleToggle(type: string, checked: boolean) {
    if (disabled) return;

    setVisibility((prev) => ({ ...prev, [type]: checked }));
    startTransition(async () => {
      await onSave(
        createThemeFieldFormData({
          configId,
          themeKey: `sectionVisible.${type}`,
          value: String(checked),
        }),
      );
    });
  }

  return {
    handleToggle,
    visibility,
  };
}

export function useBuilderSidebarSeoValues({
  configId,
  disabled = false,
  onSave,
  pageKey,
  seoValues,
}: UseBuilderSidebarSeoValuesOptions) {
  const [values, setValues] = useState({
    title: seoValues?.title ?? "",
    description: seoValues?.description ?? "",
    ogImage: seoValues?.ogImage ?? "",
  });
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(field: SeoField, value: string) {
    if (disabled) return;

    setValues((prev) => ({ ...prev, [field]: value }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        await onSave(
          createThemeFieldFormData({
            configId,
            themeKey: `seo.${pageKey}.${field}`,
            value: value.trim(),
          }),
        );
      });
    }, 600);
  }

  return {
    handleChange,
    values,
  };
}
