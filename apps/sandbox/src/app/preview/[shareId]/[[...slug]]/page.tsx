import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SandboxPublicPreview } from "@/components/sandbox-public-preview";
import { getQueryClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Template sandbox preview",
};

type Props = {
  params: Promise<{ shareId: string; slug?: string[] }>;
  searchParams: Promise<{ mode?: string | string[] }>;
};

export default async function SandboxPreviewPage({
  params,
  searchParams,
}: Props) {
  const [{ shareId, slug }, query] = await Promise.all([params, searchParams]);
  const requestedMode = Array.isArray(query.mode) ? query.mode[0] : query.mode;
  const mode = requestedMode === "live" ? "live" : "draft";
  const pathname = slug?.length ? `/${slug.join("/")}` : "/";

  try {
    const data = await getQueryClient().fetchQuery(
      trpc.templateSandbox.preview.queryOptions({
        mode,
        pathname,
        shareId,
      }),
    );
    return <SandboxPublicPreview data={data} />;
  } catch {
    notFound();
  }
}
