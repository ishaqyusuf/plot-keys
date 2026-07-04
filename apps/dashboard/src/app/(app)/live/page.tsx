import { getLivePreviewData } from "@plotkeys/db/queries";
import { extractTenantHostname } from "@plotkeys/utils";
import type { Metadata } from "next";

import { LivePreview } from "@/components/live/live-preview";
import { requireOnboardedSession } from "@/lib/session";

type LivePageProps = {
  searchParams?: Promise<{
    hostname?: string;
    subdomain?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Live Preview | Plot Keys",
};

export default async function LivePage({ searchParams }: LivePageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const preview = await getLivePreviewData({
    companySlug: session.activeMembership.companySlug,
    hostname: extractTenantHostname(params.hostname),
    subdomain: params.subdomain,
  });

  return <LivePreview preview={preview} />;
}
