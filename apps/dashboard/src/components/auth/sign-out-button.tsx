"use client";

import { cn } from "@plotkeys/ui/cn";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";

import { clearSession } from "./session-bridge";

export function SignOutButton({
  className,
  icon,
  showLabel = true,
}: {
  className?: string;
  icon?: ReactNode;
  showLabel?: boolean;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSignOut() {
    setIsPending(true);

    try {
      await clearSession();
      router.push("/sign-in");
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <SubmitButton
      variant="ghost"
      className={cn("gap-2", className)}
      isSubmitting={isPending}
      onClick={handleSignOut}
      type="button"
    >
      {icon}
      {showLabel ? "Sign out" : null}
    </SubmitButton>
  );
}
