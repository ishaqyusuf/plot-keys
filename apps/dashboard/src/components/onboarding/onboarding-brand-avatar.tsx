"use client";

import { cn } from "@plotkeys/ui/cn";
import { Icon } from "@plotkeys/ui/icons";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

function getBrandInitials(brandName: string) {
  const parts = brandName.trim().split(/\s+/).filter(Boolean).slice(0, 2);

  if (parts.length === 0) {
    return "PK";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

type Props = {
  brandName: string;
  editable?: boolean;
  logoUrl?: string | null;
};

export function OnboardingBrandAvatar({
  brandName,
  editable = false,
  logoUrl: initialLogoUrl = null,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openPicker() {
    if (!editable || isPending) {
      return;
    }

    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          body: formData,
          method: "POST",
        });
        const payload = (await response.json()) as {
          error?: string;
          publicUrl?: string;
        };

        if (!response.ok || !payload.publicUrl) {
          setError(payload.error ?? "Upload failed. Please try again.");
          return;
        }

        setLogoUrl(payload.publicUrl);
        router.refresh();
      } catch {
        setError("Upload failed. Please try again.");
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <SubmitButton
        aria-label={
          editable ? `Upload logo for ${brandName}` : `${brandName} avatar`
        }
        className={cn(
          "group relative flex size-12 items-center justify-center overflow-hidden rounded-full border border-border bg-primary text-primary-foreground text-xs font-semibold transition",
          editable
            ? "cursor-pointer hover:scale-[1.02] hover:border-primary/70"
            : "cursor-default",
        )}
        disabled={!editable || isPending}
        isSubmitting={isPending}
        onClick={openPicker}
        type="button"
      >
        {logoUrl ? (
          <Image
            alt={`${brandName} logo`}
            className="h-full w-full object-cover"
            fill
            src={logoUrl}
          />
        ) : (
          <span>{getBrandInitials(brandName)}</span>
        )}

        {editable ? (
          <>
            <span className="absolute inset-0 bg-foreground/0 transition group-hover:bg-foreground/20" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-foreground/75 px-2 py-1 text-[9px] font-medium text-primary-foreground transition group-hover:translate-y-0">
              Upload logo
            </span>
            <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full border border-background bg-background text-foreground">
              <Icon.Edit className="size-3" />
            </span>
          </>
        ) : null}
      </SubmitButton>

      <input
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file"
      />

      {error ? (
        <p className="max-w-48 text-[11px] leading-4 text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
