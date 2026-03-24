"use client";

import { Button } from "@plotkeys/ui/button";
import type { RefObject } from "react";

import { fillForm } from "./dev-form-quick-fill-fab";

type DevFormQuickFillButtonProps = {
  formRef: RefObject<HTMLFormElement | null>;
};

export function DevFormQuickFillButton({
  formRef,
}: DevFormQuickFillButtonProps) {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => {
        if (formRef.current) {
          fillForm(formRef.current);
        }
      }}
    >
      Quick fill
    </Button>
  );
}
