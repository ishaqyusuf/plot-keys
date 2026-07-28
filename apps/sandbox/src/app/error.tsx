"use client";

import { ErrorFallback } from "@/components/error-fallback";

export default function ErrorPage() {
  return (
    <main className="min-h-svh bg-muted/20 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ErrorFallback />
      </div>
    </main>
  );
}
