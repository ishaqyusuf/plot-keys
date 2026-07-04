import { TemplateSandboxWorkbench } from "@/components/template-sandbox/template-sandbox-workbench";
import { getBaseUrl } from "@/lib/get-base-url";
import { getServerTrpcClient } from "@/trpc/server";
import { notFound } from "next/navigation";

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
  const [resolvedParams, resolvedSearchParams, currentOrigin, trpc] =
    await Promise.all([
      params ?? Promise.resolve({ profileId: "" }),
      searchParams ?? Promise.resolve({ page: undefined, path: undefined }),
      getBaseUrl(),
      getServerTrpcClient(),
    ]);
  const query: { page?: string; path?: string } = resolvedSearchParams;
  const { profileId } = resolvedParams;

  try {
    const profile = await trpc.templateSandbox.get.query({ profileId });

    return (
      <main className="min-h-[calc(100svh-4rem)] overflow-hidden bg-background">
        <TemplateSandboxWorkbench
          currentOrigin={currentOrigin}
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
