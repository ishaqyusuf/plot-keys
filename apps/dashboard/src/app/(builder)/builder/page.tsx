import type { Metadata } from "next";
import type { SearchParams } from "nuqs";

import { BuilderWorkspace } from "@/components/builder/builder-workspace";
import { ensureBuilderConfigurationExists } from "@/components/dashboard/home/builder-configuration";
import { requireOnboardedSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Builder | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

function firstSearchParam(value: SearchParams[string]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BuilderPage({ searchParams }: Props) {
  const session = await requireOnboardedSession();
  const params = await searchParams;
  const error = firstSearchParam(params.error);
  const generated = firstSearchParam(params.generated);
  const onboarding = firstSearchParam(params.onboarding);
  const page = firstSearchParam(params.page);
  const path = firstSearchParam(params.path);
  const saved = firstSearchParam(params.saved);

  await ensureBuilderConfigurationExists();

  return (
    <main className="min-h-screen bg-background">
      <BuilderWorkspace
        companyName={session.activeMembership.companyName}
        companySlug={session.activeMembership.companySlug}
        notices={{ error, generated, onboarding, saved }}
        pageKey={page}
        previewPath={path}
      />
    </main>
  );
}
