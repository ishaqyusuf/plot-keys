"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@plotkeys/ui/avatar";
import { cn } from "@plotkeys/ui/cn";
import { Spinner } from "@plotkeys/ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState, useTransition } from "react";
import { useTRPC } from "@/trpc/client";

type Props = {
  className?: string;
  companyName: string;
  logoUrl?: string | null;
  onUpload?: (url: string) => void;
  size?: number;
};

export function CompanyLogoUpload({
  className,
  companyName,
  logoUrl: initialLogoUrl = null,
  onUpload,
  size = 65,
}: Props) {
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [uploading, startUpload] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateTeamMutation = useMutation(
    trpc.team.update.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries({
          queryKey: trpc.team.current.queryKey(),
        });
      },
    }),
  );

  const isLoading = uploading || updateTeamMutation.isPending;

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    startUpload(async () => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          body: formData,
          method: "POST",
        });
        const payload = (await response.json()) as { publicUrl?: string };

        if (!response.ok || !payload.publicUrl) {
          return;
        }

        setLogoUrl(payload.publicUrl);
        updateTeamMutation.mutate({ logoUrl: payload.publicUrl });
        onUpload?.(payload.publicUrl);
      } catch {
        // Match Midday's avatar upload: upload failures stay outside the card UI.
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    });
  }

  return (
    <Avatar
      className={cn(
        "flex items-center justify-center rounded-none border border-border bg-accent cursor-pointer",
        className,
      )}
      onClick={() => {
        if (!isLoading) {
          fileInputRef.current?.click();
        }
      }}
      style={{ width: size, height: size }}
    >
      {isLoading ? (
        <Spinner className="h-4 w-4" />
      ) : (
        <>
          <AvatarImage alt={companyName} src={logoUrl ?? undefined} />
          <AvatarFallback className="rounded-none">
            <span className="text-md">{companyName.charAt(0)}</span>
          </AvatarFallback>
        </>
      )}
      <input
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        multiple={false}
        onChange={handleUpload}
        ref={fileInputRef}
        style={{ display: "none" }}
        type="file"
      />
    </Avatar>
  );
}
