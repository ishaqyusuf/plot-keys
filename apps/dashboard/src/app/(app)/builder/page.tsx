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
    <main className="min-h-screen bg-background px-2 py-2 md:px-3 md:py-3">
      <div className="mx-auto">
        <BuilderWorkspace
          companyId={session.activeMembership.companyId}
          companyName={session.activeMembership.companyName}
          companySlug={session.activeMembership.companySlug}
          notices={params}
          pageKey={params.page}
          previewPath={params.path}
          pageKey={params.page}
          userId={session.user.id}
        />
      </div>
    </main>
  );
}
