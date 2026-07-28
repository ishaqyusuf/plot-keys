import { buildLegacyTemplateSandboxProfileRedirectUrl } from "@plotkeys/utils";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs";

import { buildLegacySandboxRedirect } from "@/lib/sandbox-redirect";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ profileId: string }>;
  searchParams: Promise<SearchParams>;
};

function first(value: SearchParams[string]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LegacyTemplateSandboxProfilePage({
  params,
  searchParams,
}: Props) {
  const [{ profileId }, query] = await Promise.all([params, searchParams]);
  const page = first(query.page);
  const path = first(query.path);
  redirect(
    buildLegacyTemplateSandboxProfileRedirectUrl(profileId, {
      currentOrigin: await buildLegacySandboxRedirect("/"),
      page,
      path,
    }),
  );
}
