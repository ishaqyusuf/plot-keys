"use client";

import { Button } from "@plotkeys/ui/button";
import { useTransition } from "react";
import { installAppAction, uninstallAppAction } from "../../actions";

type Props = {
  appKey: string;
  installed: boolean;
};

export function InstallButton({ appKey, installed }: Props) {
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      if (installed) {
        await uninstallAppAction(appKey);
      } else {
        await installAppAction(appKey);
      }
    });
  }

  return (
    <Button
      size="sm"
      variant={installed ? "outline" : "default"}
      onClick={toggle}
      disabled={isPending}
    >
      {isPending ? "Saving…" : installed ? "Uninstall" : "Install"}
    </Button>
  );
}
