import type { Metadata } from "next";
import { Suspense } from "react";

import { IntegrationSettingsList } from "@/components/integrations/integration-settings-list";
import { requireOnboardedSession } from "@/lib/session";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Integration Settings | Plot Keys",
};

export default async function IntegrationsPage() {
  await requireOnboardedSession();

  prefetch(trpc.integrations.get.queryOptions());

  return (
    <HydrateClient>
      <Suspense>
        <IntegrationSettingsList />
      </Suspense>
    </HydrateClient>
  );
}
