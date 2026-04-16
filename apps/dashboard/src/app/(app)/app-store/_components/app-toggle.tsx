"use client";

import { Switch } from "@plotkeys/ui/switch";
import { useTransition } from "react";

import { setAppEnabled } from "../actions";

type AppToggleProps = {
  appId: string;
  disabled?: boolean;
  enabled: boolean;
};

export function AppToggle({ appId, disabled, enabled }: AppToggleProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Switch
      checked={enabled}
      disabled={disabled || isPending}
      onCheckedChange={(next) => {
        startTransition(async () => {
          const result = await setAppEnabled(appId, next);
          if (!result.ok) {
            console.error(result.error);
          }
        });
      }}
      aria-label={enabled ? "Disable app" : "Enable app"}
    />
  );
}
