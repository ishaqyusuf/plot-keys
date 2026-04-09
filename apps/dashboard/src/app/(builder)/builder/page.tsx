import { BuilderWorkspace } from "../../../components/builder/builder-workspace";
import { requireOnboardedSession } from "../../../lib/session";

type BuilderPageProps = {
  searchParams?: Promise<{
    error?: string;
    configId?: string;
    generated?: string;
    onboarding?: string;
    page?: string;
    path?: string;
    published?: string;
    saved?: string;
  }>;
};

export default async function BuilderPage({ searchParams }: BuilderPageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};

  return (
    <main className="min-h-screen bg-background">
      <BuilderWorkspace
        companyId={session.activeMembership.companyId}
        companyName={session.activeMembership.companyName}
        companySlug={session.activeMembership.companySlug}
        notices={params}
        pageKey={params.page}
        previewPath={params.path}
        userId={session.user.id}
      />
    </main>
  );
}
