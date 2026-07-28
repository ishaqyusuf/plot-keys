"use client";

import type { ButtonProps } from "@plotkeys/ui/button";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  disabled?: boolean;
  isSubmitting?: boolean;
  onClick: () => void;
  variant?: ButtonProps["variant"];
};

export function BulkClientAction({
  children,
  disabled,
  isSubmitting = false,
  onClick,
  variant = "ghost",
}: Props) {
  return (
    <SubmitButton
      isSubmitting={isSubmitting}
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      size="sm"
    >
      {children}
    </SubmitButton>
  );
}
