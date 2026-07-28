import { buildSandboxUrl } from "@plotkeys/utils/app-urls";
import { headers } from "next/headers";
import { Suspense } from "react";

import { TemplateSandboxSkeleton } from "@/components/template-sandbox/skeleton";
import { TemplateSandboxIndex } from "@/components/template-sandbox/template-sandbox-index";
import { requirePlatformAdmin } from "@/lib/require-platform-admin";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

export default async function SandboxProfilesPage() {
  const [session, requestHeaders] = await Promise.all([
    requirePlatformAdmin("/"),
    headers(),
  ]);
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");
  const currentOrigin = buildSandboxUrl({
    currentHost: host,
    currentProtocol: protocol,
  });

  batchPrefetch([
    trpc.templateSandbox.list.queryOptions(),
    trpc.templateSandbox.catalog.queryOptions(),
  ]);

  return (
    <main className="min-h-svh bg-muted/20 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <HydrateClient>
          <Suspense fallback={<TemplateSandboxSkeleton />}>
            <TemplateSandboxIndex
              administrator={{
                email: session.user.email,
                name: session.user.name,
              }}
              currentOrigin={currentOrigin}
            />
          </Suspense>
        </HydrateClient>
      </div>
    </main>
  );
}
