import { redirect } from "next/navigation";

import { buildLegacySandboxRedirect } from "@/lib/sandbox-redirect";

export const dynamic = "force-dynamic";

export default async function LegacyTemplateSandboxProfilesPage() {
  redirect(await buildLegacySandboxRedirect("/"));
}
