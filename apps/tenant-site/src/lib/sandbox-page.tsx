import { buildLegacyTemplateSandboxPreviewRedirectUrl } from "@plotkeys/utils";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type SandboxPageRouteProps<
  TParams = { shareId?: string; slug?: string },
> = {
  params?: Promise<TParams>;
  searchParams?: Promise<{
    mode?: string;
    renderMode?: string;
  }>;
};

function pathnameForPage(pageKey: string, routeSlug?: string | null) {
  if (pageKey === "home") return "/";
  if (pageKey === "blog-post" && routeSlug) return `/blog/${routeSlug}`;
  if (pageKey === "blog") return "/blog";
  if (pageKey === "contact") return "/contact";
  if (pageKey === "roadmap") return "/roadmap";
  return "/";
}

export async function generateSandboxPageMetadata(): Promise<Metadata> {
  return {
    robots: {
      follow: false,
      index: false,
    },
    title: "Template sandbox",
  };
}

export function createSandboxPageRoute(pageKey: string) {
  async function Page({
    params,
    searchParams,
  }: SandboxPageRouteProps<{ shareId?: string; slug?: string }>) {
    const [resolvedParams, resolvedQuery, requestHeaders] = await Promise.all([
      params,
      searchParams,
      headers(),
    ]);
    const shareId = resolvedParams?.shareId ?? "";
    const mode =
      resolvedQuery?.renderMode === "live" || resolvedQuery?.mode === "live"
        ? "live"
        : "draft";
    const host =
      requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    const protocol =
      requestHeaders.get("x-forwarded-proto") ??
      (process.env.NODE_ENV === "production" ? "https" : "http");
    const currentOrigin = host ? `${protocol}://${host}` : null;
    redirect(
      buildLegacyTemplateSandboxPreviewRedirectUrl(shareId, {
        currentOrigin,
        mode,
        pathname: pathnameForPage(pageKey, resolvedParams?.slug),
      }),
    );
  }

  return {
    generateMetadata: generateSandboxPageMetadata,
    Page,
  };
}
