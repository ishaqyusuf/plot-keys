"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useTRPC } from "@/trpc/client";

type BuilderPreviewAction = (formData: FormData) => Promise<void>;

type UseBuilderPreviewActionsParams = {
  configId: string;
  onSmartFill?: BuilderPreviewAction;
  onUpdateField?: BuilderPreviewAction;
};

export function useBuilderPreviewActions({
  configId,
  onSmartFill,
  onUpdateField,
}: UseBuilderPreviewActionsParams) {
  const router = useRouter();
  const trpc = useTRPC();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const updateFieldMutation = useMutation(
    trpc.website.updateContentField.mutationOptions({
      onSuccess: () => {
        setErrorMessage(null);
        router.refresh();
      },
    }),
  );
  const smartFillMutation = useMutation(
    trpc.website.smartFillField.mutationOptions({
      onSuccess: () => {
        setErrorMessage(null);
        router.refresh();
      },
    }),
  );

  const handleFieldUpdate = useCallback(
    async (formData: FormData) => {
      setErrorMessage(null);

      try {
        await updateFieldMutation.mutateAsync({
          configId: String(formData.get("configId") ?? ""),
          contentKey: String(formData.get("contentKey") ?? ""),
          value: String(formData.get("value") ?? ""),
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to update template field.",
        );
      }
    },
    [updateFieldMutation],
  );

  const handleFieldSmartFill = useCallback(
    async (formData: FormData) => {
      setErrorMessage(null);

      try {
        await smartFillMutation.mutateAsync({
          configId: String(formData.get("configId") ?? ""),
          contentKey: String(formData.get("contentKey") ?? ""),
          longDetail:
            String(formData.get("longDetail") ?? "").trim() || undefined,
          preferredLength:
            String(formData.get("preferredLength") ?? "").trim() || undefined,
          shortDetail: String(formData.get("shortDetail") ?? ""),
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to smart-fill field.",
        );
      }
    },
    [smartFillMutation],
  );

  const updateField = onUpdateField ?? handleFieldUpdate;
  const smartFill = onSmartFill ?? handleFieldSmartFill;

  const handleInlineSmartFill = useCallback(
    async (contentKey: string) => {
      const fd = new FormData();
      fd.set("configId", configId);
      fd.set("contentKey", contentKey);
      fd.set(
        "shortDetail",
        contentKey
          .replace(/\./g, " ")
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .toLowerCase(),
      );
      await smartFill(fd);
    },
    [configId, smartFill],
  );

  const handleInlineContentCommit = useCallback(
    async (contentKey: string, value: string) => {
      const fd = new FormData();
      fd.set("configId", configId);
      fd.set("contentKey", contentKey);
      fd.set("value", value);
      await updateField(fd);
    },
    [configId, updateField],
  );

  return {
    errorMessage,
    handleInlineContentCommit,
    handleInlineSmartFill,
    smartFill,
    updateField,
  };
}
