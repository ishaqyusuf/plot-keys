"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useTRPC } from "@/trpc/client";

export function useBuilderSidebarThemeActions() {
  const router = useRouter();
  const trpc = useTRPC();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const updateThemeMutation = useMutation(
    trpc.website.updateThemeField.mutationOptions({
      onSuccess: () => {
        setErrorMessage(null);
        router.refresh();
      },
    }),
  );
  const saveThemeField = useCallback(
    async (formData: FormData) => {
      await updateThemeMutation.mutateAsync({
        configId: String(formData.get("configId") ?? ""),
        themeKey: String(formData.get("themeKey") ?? ""),
        value: String(formData.get("value") ?? ""),
      });
    },
    [updateThemeMutation],
  );
  const handleUpdateTheme = useCallback(
    async (formData: FormData) => {
      try {
        await saveThemeField(formData);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to update theme field.",
        );
      }
    },
    [saveThemeField],
  );
  const handleUpdateThemeSilent = useCallback(
    async (formData: FormData) => {
      try {
        await saveThemeField(formData);
      } catch {
        // Keep optimistic controls responsive when a background save fails.
      }
    },
    [saveThemeField],
  );

  return {
    errorMessage,
    handleUpdateTheme,
    handleUpdateThemeSilent,
  };
}
