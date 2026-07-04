import { isVercelDomainProvisioningConfigured } from "@plotkeys/utils";
import type { Metadata } from "next";

import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ConnectDomainView } from "@/components/domains/connect-domain-view";
import { requireOnboardedSession } from "@/lib/session";

type ConnectDomainPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export const metadata: Metadata = {
  title: "Connect Domain | Plot Keys",
};

export default async function ConnectDomainPage({
  searchParams,
}: ConnectDomainPageProps) {
  await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const vercelReady = isVercelDomainProvisioningConfigured();

  return (
    <DashboardPage className="max-w-none">
      <ConnectDomainView error={params.error} vercelReady={vercelReady} />
    </DashboardPage>
  );
}
