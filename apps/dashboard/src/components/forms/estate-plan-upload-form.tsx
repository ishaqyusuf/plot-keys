"use client";

import { Button } from "@plotkeys/ui/button";
import { Input } from "@plotkeys/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { useTRPC } from "@/trpc/client";

type EstatePlanUploadFormProps = {
  estateId: string;
  estateSlug: string;
};

export function EstatePlanUploadForm({
  estateId,
  estateSlug,
}: EstatePlanUploadFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [sourceUrl, setSourceUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const createLayoutMutation = useMutation(
    trpc.workspace.createEstateLayout.mutationOptions({
      async onSuccess() {
        setSourceUrl("");
        await queryClient.invalidateQueries({
          queryKey: trpc.workspace.getEstateDetail.queryKey({
            slug: estateSlug,
          }),
        });
      },
    }),
  );

  async function handleUpload(file: File | null) {
    setError(null);
    setSourceUrl("");

    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", "estate-plans");

      const response = await fetch("/api/upload", {
        body: formData,
        method: "POST",
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        publicUrl?: string;
      } | null;

      if (!response.ok || !payload?.publicUrl) {
        throw new Error(payload?.error ?? "Upload failed.");
      }

      setSourceUrl(payload.publicUrl);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload estate plan.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!sourceUrl) {
      setError("Upload an estate plan before saving.");
      return;
    }

    await createLayoutMutation.mutateAsync({
      estateId,
      sourceUrl,
    });
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <Input
        accept="image/png,image/jpeg,image/webp,application/pdf"
        disabled={uploading}
        onChange={(event) => handleUpload(event.target.files?.[0] ?? null)}
        type="file"
      />
      {sourceUrl ? (
        <p className="text-xs text-muted-foreground">
          Plan uploaded. Save it to add a new layout version.
        </p>
      ) : null}
      {error || createLayoutMutation.error ? (
        <p className="text-xs text-destructive">
          {error ?? createLayoutMutation.error?.message}
        </p>
      ) : null}
      <Button
        disabled={!sourceUrl || uploading || createLayoutMutation.isPending}
        size="sm"
        type="submit"
      >
        {uploading || createLayoutMutation.isPending
          ? "Uploading..."
          : "Save estate plan"}
      </Button>
    </form>
  );
}
