"use client";

import { Button } from "@plotkeys/ui/button";
import { cn } from "@plotkeys/utils";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";

import { clearSession } from "./session-bridge";

export function SignOutButton({
  className,
  icon,
}: {
  className?: string;
  icon?: ReactNode;
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
    <Button
      className={cn("gap-2", className)}
      disabled={isPending}
      onClick={handleSignOut}
      type="button"
      variant="ghost"
    >
      {icon}
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
