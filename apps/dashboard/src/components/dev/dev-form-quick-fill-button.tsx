"use client";

import { Button } from "@plotkeys/ui/button";
import { useState } from "react";

type DevFormQuickFillButtonProps = {
  onFill: () => void | Promise<void>;
};

export function DevFormQuickFillButton({
  onFill,
}: DevFormQuickFillButtonProps) {
  const [busy, setBusy] = useState(false);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await onFill();
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? "Filling..." : "Quick fill"}
    </Button>
  );
}
