"use client";

import { Alert, AlertDescription } from "@plotkeys/ui/alert";

export function AuthFormError({ message }: { message?: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
