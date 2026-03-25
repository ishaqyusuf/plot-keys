"use client";

import { Button } from "@plotkeys/ui/button";
import { useRef, useState } from "react";

import { type QuickFillProfile, runQuickFill } from "./quick-fill";

type DevFormQuickFillButtonProps = {
  profile: QuickFillProfile;
};

export function DevFormQuickFillButton({
  profile,
}: DevFormQuickFillButtonProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div ref={anchorRef}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={busy}
        onClick={async () => {
          const form = anchorRef.current?.closest("form");

          if (!(form instanceof HTMLFormElement)) {
            return;
          }

          setBusy(true);
          try {
            await runQuickFill(form, profile);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Filling..." : "Quick fill"}
      </Button>
    </div>
  );
}
