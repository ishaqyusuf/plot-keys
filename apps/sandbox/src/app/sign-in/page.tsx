import type { Metadata } from "next";
import { Suspense } from "react";

import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in | PlotKeys Sandbox",
};

type Props = {
  searchParams: Promise<{ error?: string | string[] }>;
};

export default async function SandboxSignInPage({ searchParams }: Props) {
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  return (
    <main className="grid min-h-svh place-items-center bg-muted/30 px-4 py-12">
      <section className="w-full max-w-md border bg-background p-6 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">
          Dedicated testing environment
        </p>
        <h1 className="mt-1 text-2xl font-semibold">PlotKeys Sandbox</h1>
        <p className="mt-2 mb-6 text-sm text-muted-foreground">
          Sign in with a platform administrator account. Tenant accounts cannot
          author sandbox profiles.
        </p>
        <Suspense>
          <SignInForm initialError={error} />
        </Suspense>
      </section>
    </main>
  );
}
