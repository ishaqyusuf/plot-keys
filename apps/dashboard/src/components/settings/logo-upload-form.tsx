"use client";

import { Button } from "@plotkeys/ui/button";
import { Input } from "@plotkeys/ui/input";
import { useRef, useState, useTransition } from "react";
import { setCompanyLogoAction } from "../../app/actions";

type LogoUploadFormProps = {
  currentLogoUrl: string | null;
};

export function LogoUploadForm({ currentLogoUrl }: LogoUploadFormProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(currentLogoUrl);
  const [error, setError] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();
  const [saving, startSave] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    setError(null);

    startUpload(async () => {
      const fd = new FormData();
      fd.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });
        const json = (await res.json()) as { publicUrl?: string; error?: string };

        if (!res.ok || !json.publicUrl) {
          setError(json.error ?? "Upload failed. Please try again.");
          return;
        }

        setLogoUrl(json.publicUrl);
      } catch {
        setError("Network error. Please check your connection and try again.");
      }
    });
  }

  function handleSave() {
    setError(null);
    const fd = new FormData();
    if (logoUrl) fd.append("logoUrl", logoUrl);

    startSave(async () => {
      await setCompanyLogoAction(fd);
    });
  }

  function handleRemove() {
    setError(null);
    const fd = new FormData();
    // No logoUrl appended → sets null
    startSave(async () => {
      await setCompanyLogoAction(fd);
    });
    setLogoUrl(null);
  }

  const isPending = uploading || saving;

  return (
    <div className="space-y-5">
      {error ? (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {/* Preview */}
      <div className="flex items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-border bg-muted/40">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt="Company logo"
              className="h-full w-full rounded-xl object-contain p-2"
              src={logoUrl}
            />
          ) : (
            <span className="text-xs text-muted-foreground">No logo</span>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Company logo</p>
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, WebP or SVG — max 5 MB
          </p>
          <div className="flex gap-2">
            <Button
              disabled={isPending}
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              type="button"
              variant="outline"
            >
              {uploading ? "Uploading…" : "Upload image"}
            </Button>
            {logoUrl ? (
              <Button
                disabled={isPending}
                onClick={handleRemove}
                size="sm"
                type="button"
                variant="ghost"
              >
                Remove
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
        type="file"
      />

      {/* Manual URL input as fallback */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="logo-url">
          Or paste a logo URL
        </label>
        <Input
          id="logo-url"
          onChange={(e) => setLogoUrl(e.currentTarget.value || null)}
          placeholder="https://example.com/logo.png"
          type="url"
          value={logoUrl ?? ""}
        />
      </div>

      <Button disabled={isPending} onClick={handleSave} type="button">
        {saving ? "Saving…" : "Save logo"}
      </Button>
    </div>
  );
}
