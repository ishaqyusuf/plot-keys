import { TemplateSandboxWorkbench } from "@/components/template-sandbox/template-sandbox-workbench";
import { getServerTrpcClient } from "@/trpc/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type TemplateSandboxDetailPageProps = {
  params?: Promise<{ profileId: string }>;
  searchParams?: Promise<{
    page?: string;
    path?: string;
  }>;
};

export default async function TemplateSandboxDetailPage({
  params,
  searchParams,
}: TemplateSandboxDetailPageProps) {
  const [resolvedParams, resolvedSearchParams, trpc] =
    await Promise.all([
      params ?? Promise.resolve({ profileId: "" }),
      searchParams ?? Promise.resolve({ page: undefined, path: undefined }),
      getServerTrpcClient(),
    ]);
  const query: { page?: string; path?: string } = resolvedSearchParams;
  const { profileId } = resolvedParams;

  try {
    const profile = await trpc.templateSandbox.get.query({ profileId });

    return (
      <main className="h-svh overflow-hidden bg-background">
        <TemplateSandboxWorkbench
          pageKey={query.page}
          previewPath={query.path}
          profile={profile}
        />
      </main>
    );
  } catch {
    notFound();
  }
}
