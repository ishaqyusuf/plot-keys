"use client";

import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useState } from "react";

type Props = {
  onFill: () => void | Promise<void>;
};

export function DevFormQuickFillButton({ onFill }: Props) {
  const [busy, setBusy] = useState(false);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <SubmitButton
      isSubmitting={busy}
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
      Quick fill
    </SubmitButton>
  );
}
