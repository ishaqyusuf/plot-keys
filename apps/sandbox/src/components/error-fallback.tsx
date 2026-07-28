"use client";

import { Button } from "@plotkeys/ui/button";
import { useRouter } from "next/navigation";

export function ErrorFallback() {
  const router = useRouter();

  return (
    <div className="grid min-h-72 place-items-center border bg-background p-8">
      <div className="text-center">
        <h2 className="font-medium">Sandbox profiles could not be loaded</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Check the testing database connection and try again.
        </p>
        <Button
          className="mt-4"
          onClick={() => router.refresh()}
          variant="outline"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
