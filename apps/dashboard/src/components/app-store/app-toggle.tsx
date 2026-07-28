"use client";

import { Switch } from "@plotkeys/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useTRPC } from "@/trpc/client";

type Props = {
  appId: string;
  disabled?: boolean;
  enabled: boolean;
};

export function AppToggle({ appId, disabled, enabled }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAppEnabledMutation = useMutation(
    trpc.apps.setEnabled.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries({
          queryKey: trpc.apps.get.queryKey(),
        });
        router.refresh();
      },
    }),
  );

  return (
    <Switch
      aria-label={enabled ? "Disable app" : "Enable app"}
      checked={enabled}
      disabled={disabled || setAppEnabledMutation.isPending}
      onCheckedChange={(next) => {
        setAppEnabledMutation.mutate({ appId, enabled: next });
      }}
    />
  );
}
