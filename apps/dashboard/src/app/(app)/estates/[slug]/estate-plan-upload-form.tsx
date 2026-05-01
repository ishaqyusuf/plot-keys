"use client";

import { Button } from "@plotkeys/ui/button";
import { Input } from "@plotkeys/ui/input";
import { useState } from "react";
import { createEstateLayoutAction } from "../../../actions";

type EstatePlanUploadFormProps = {
  estateId: string;
  estateSlug: string;
};

export function EstatePlanUploadForm({
  estateId,
  estateSlug,
}: EstatePlanUploadFormProps) {
  const [sourceUrl, setSourceUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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

  return (
    <form action={createEstateLayoutAction} className="space-y-3">
      <input name="estateId" type="hidden" value={estateId} />
      <input name="estateSlug" type="hidden" value={estateSlug} />
      <input name="sourceUrl" type="hidden" value={sourceUrl} />
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
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      <Button disabled={!sourceUrl || uploading} size="sm" type="submit">
        {uploading ? "Uploading..." : "Save estate plan"}
      </Button>
    </form>
  );
}
