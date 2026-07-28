"use client";

import { Button } from "@plotkeys/ui/button";
import { useState } from "react";

export function SignOutButton() {
  const [isPending, setIsPending] = useState(false);

  return (
    <Button
      disabled={isPending}
      onClick={async () => {
        setIsPending(true);
        await fetch("/api/session", {
          credentials: "include",
          method: "DELETE",
        });
        window.location.assign("/sign-in");
      }}
      size="sm"
      variant="outline"
    >
      {isPending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
