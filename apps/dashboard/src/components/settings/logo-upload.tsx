"use client";

import { Button } from "@plotkeys/ui/button";
import {
  storageBuckets,
  buildTenantStoragePath,
} from "@plotkeys/platform-integrations/storage";
import {
  createSupabaseBrowserClient,
  type PublicSupabaseEnv,
} from "@plotkeys/platform-integrations/supabase";
import { useRef, useState, useTransition } from "react";

type LogoUploadProps = {
  companyId: string;
  currentLogoUrl: string | null;
  onSave: (logoUrl: string | null) => Promise<void>;
  supabaseEnv: PublicSupabaseEnv | null;
};

export function LogoUpload({
  companyId,
  currentLogoUrl,
  onSave,
  supabaseEnv,
}: LogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentLogoUrl);
  const [urlInput, setUrlInput] = useState(currentLogoUrl ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"upload" | "url">(
    supabaseEnv ? "upload" : "url",
  );

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setError("File is too large. Maximum size is 2 MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, SVG, WebP).");
      return;
    }

    setError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    startTransition(async () => {
      try {
        if (!supabaseEnv) {
          setError("Storage is not configured. Please use a URL instead.");
          return;
        }

        const client = createSupabaseBrowserClient(supabaseEnv);
        const ext = file.name.split(".").pop() ?? "png";
        const fileName = `logo-${Date.now()}.${ext}`;
        const path = buildTenantStoragePath({
          companyId,
          fileName,
          folder: "logos",
        });

        const { error: uploadError } = await client.storage
          .from(storageBuckets.logos)
          .upload(path, file, {
            contentType: file.type,
            upsert: true,
          });

        if (uploadError) {
          setError(`Upload failed: ${uploadError.message}`);
          return;
        }

        const { data: urlData } = client.storage
          .from(storageBuckets.logos)
          .getPublicUrl(path);

        await onSave(urlData.publicUrl);
        setPreview(urlData.publicUrl);
        setUrlInput(urlData.publicUrl);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Upload failed unexpectedly.",
        );
      }
    });
  }

  function handleUrlSave() {
    setError(null);
    const url = urlInput.trim();

    startTransition(async () => {
      try {
        await onSave(url || null);
        setPreview(url || null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to save logo URL.",
        );
      }
    });
  }

  function handleRemove() {
    setError(null);
    startTransition(async () => {
      try {
        await onSave(null);
        setPreview(null);
        setUrlInput("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to remove logo.",
        );
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Preview */}
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40">
          {preview ? (
            <img
              src={preview}
              alt="Company logo"
              className="h-full w-full rounded-lg object-contain p-1"
            />
          ) : (
            <span className="text-xs text-muted-foreground">No logo</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">Company logo</p>
          <p className="text-xs text-muted-foreground">
            Displayed on your website header and footer. Recommended: 200×60px,
            PNG or SVG.
          </p>
        </div>
      </div>

      {/* Mode switcher */}
      {supabaseEnv ? (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={mode === "upload" ? "default" : "outline"}
            onClick={() => setMode("upload")}
            type="button"
          >
            Upload file
          </Button>
          <Button
            size="sm"
            variant={mode === "url" ? "default" : "outline"}
            onClick={() => setMode("url")}
            type="button"
          >
            Paste URL
          </Button>
        </div>
      ) : null}

      {/* Upload mode */}
      {mode === "upload" && supabaseEnv ? (
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:text-primary-foreground"
            onChange={handleFileSelect}
            disabled={isPending}
          />
        </div>
      ) : null}

      {/* URL mode */}
      {mode === "url" ? (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/logo.png"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            disabled={isPending}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            size="sm"
            onClick={handleUrlSave}
            disabled={isPending}
            type="button"
          >
            {isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      ) : null}

      {/* Remove button */}
      {preview ? (
        <div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRemove}
            disabled={isPending}
            type="button"
            className="text-destructive hover:text-destructive"
          >
            Remove logo
          </Button>
        </div>
      ) : null}

      {/* Error display */}
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
