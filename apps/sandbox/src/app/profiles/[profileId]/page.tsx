import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs";

import { TemplateSandboxWorkbench } from "@/components/template-sandbox/template-sandbox-workbench";
import { requirePlatformAdmin } from "@/lib/require-platform-admin";
import { getQueryClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Configure | PlotKeys Sandbox",
};

type Props = {
  params: Promise<{ profileId: string }>;
  searchParams: Promise<SearchParams>;
};

function first(value: SearchParams[string]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SandboxProfilePage({
  params,
  searchParams,
}: Props) {
  const [{ profileId }, query] = await Promise.all([params, searchParams]);
  await requirePlatformAdmin(`/profiles/${profileId}`);

  try {
    const profile = await getQueryClient().fetchQuery(
      trpc.templateSandbox.get.queryOptions({ profileId }),
    );

    return (
      <main className="h-svh overflow-hidden bg-background">
        <TemplateSandboxWorkbench
          pageKey={first(query.page)}
          previewPath={first(query.path)}
          profile={profile}
        />
      </main>
    );
  } catch {
    notFound();
  }
}
