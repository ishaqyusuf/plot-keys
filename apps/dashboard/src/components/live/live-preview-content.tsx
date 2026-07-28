import "server-only";

import { extractTenantHostname } from "@plotkeys/utils";
import { getQueryClient, trpc } from "@/trpc/server";

import { LivePreview } from "./live-preview";

type Props = {
  hostname?: string;
  subdomain?: string;
};

export async function LivePreviewContent({ hostname, subdomain }: Props) {
  const queryClient = getQueryClient();
  const preview = await queryClient.fetchQuery(
    trpc.website.preview.queryOptions({
      hostname: extractTenantHostname(hostname),
      subdomain,
    }),
  );

  return <LivePreview preview={preview} />;
}
