"use client";

import { Button } from "@plotkeys/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { clearSession } from "./session-bridge";

export function SignOutButton() {
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
    <Button disabled={isPending} onClick={handleSignOut} type="button" variant="ghost">
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
