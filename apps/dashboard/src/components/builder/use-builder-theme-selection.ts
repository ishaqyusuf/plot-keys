"use client";

import { useState, useTransition } from "react";

export type SaveBuilderThemeField = (formData: FormData) => Promise<void>;

type UseBuilderThemeSelectionOptions = {
  configId: string;
  disabled?: boolean;
  onSave: SaveBuilderThemeField;
  onSaveSilent?: SaveBuilderThemeField;
  themeKey: string;
  value: string;
};

async function saveBuilderThemeSelection({
  configId,
  onSave,
  onSaveSilent,
  themeKey,
  value,
}: {
  configId: string;
  onSave: SaveBuilderThemeField;
  onSaveSilent?: SaveBuilderThemeField;
  themeKey: string;
  value: string;
}) {
  const fd = new FormData();
  fd.set("configId", configId);
  fd.set("themeKey", themeKey);
  fd.set("value", value);

  if (onSaveSilent) {
    await onSaveSilent(fd);
    return;
  }

  await onSave(fd);
}

export function useBuilderThemeSelection({
  configId,
  disabled = false,
  onSave,
  onSaveSilent,
  themeKey,
  value,
}: UseBuilderThemeSelectionOptions) {
  const [optimisticValue, setOptimisticValue] = useState(value);
  const [, startTransition] = useTransition();

  function handleChange(nextValue: string) {
    if (disabled) return;

    setOptimisticValue(nextValue);
    startTransition(async () => {
      await saveBuilderThemeSelection({
        configId,
        onSave,
        onSaveSilent,
        themeKey,
        value: nextValue,
      });
    });
  }

  return {
    handleChange,
    optimisticValue,
  };
}
