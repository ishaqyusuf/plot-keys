"use client";

import { DropdownMenuItem } from "@plotkeys/ui/dropdown-menu";
import { Spinner } from "@plotkeys/ui/spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clearSession } from "@/components/auth/session-bridge";

export function SignOut() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSignOut(event: Event) {
    event.preventDefault();
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
    <DropdownMenuItem
      className="text-xs"
      data-track="User Signed Out"
      disabled={isPending}
      onSelect={handleSignOut}
    >
      <span className={isPending ? "invisible" : undefined}>Sign out</span>
      {isPending ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner className="h-4 w-4" />
        </span>
      ) : null}
    </DropdownMenuItem>
  );
}
