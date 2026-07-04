import {
  deserializeTemplateConfig,
  getRegisterTemplate,
  getTemplatePageInventoryStrict,
  resolvePage,
  type HomeSectionDefinition,
} from "@plotkeys/section-registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import { RegisterFooter } from "../components/register-footer";
import { RegisterNav } from "../components/register-nav";
import { TenantInteractionShell } from "../components/tenant-interaction-shell";
import { resolveSandboxProfileRenderData } from "./sandbox-profile";

export type SandboxPageRouteProps<TParams = { shareId?: string; slug?: string }> = {
  params?: Promise<TParams>;
};

type SandboxPageOptions = {
  pageKey: string;
  routeSlug?: string | null;
  shareId: string;
};

function renderSection(
  section: HomeSectionDefinition,
  theme: ReturnType<typeof resolvePage>["theme"],
): JSX.Element {
  const SectionComponent = section.component as (props: {
    config: HomeSectionDefinition["config"];
    theme: typeof theme;
  }) => JSX.Element;

  return (
    <SectionComponent key={section.id} config={section.config} theme={theme} />
  );
}

function pageSupported(templateKey: string, pageKey: string) {
  try {
    return getTemplatePageInventoryStrict(templateKey).pages.some(
      (page) => page.pageKey === pageKey,
    );
  } catch {
    return false;
  }
}

function canonicalSandboxPath(
  shareId: string,
  pageKey: string,
  routeSlug?: string | null,
) {
  const prefix = `/sandbox/${shareId}`;
  if (pageKey === "home") return prefix;
  if (pageKey === "blog-post" && routeSlug) return `${prefix}/blog/${routeSlug}`;
  if (pageKey === "blog") return `${prefix}/blog`;
  if (pageKey === "contact") return `${prefix}/contact`;
  if (pageKey === "roadmap") return `${prefix}/roadmap`;
  return prefix;
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

export async function renderSandboxPage({
  pageKey,
  routeSlug,
  shareId,
}: SandboxPageOptions) {
  const sandbox = await resolveSandboxProfileRenderData(shareId, routeSlug);
  if (!sandbox) notFound();

  if (!pageSupported(sandbox.templateKey, pageKey)) {
    notFound();
  }

  if (pageKey === "blog-post" && !sandbox.currentBlogPost) {
    notFound();
  }

  const resolved = resolvePage(
    sandbox.templateKey,
    pageKey,
    {
      companyName: sandbox.companyName,
      content: sandbox.content,
      currentBlogPost: sandbox.currentBlogPost,
      liveAgents: sandbox.liveAgents,
      liveBlogPosts: sandbox.liveBlogPosts,
      liveListings: sandbox.liveListings,
      market: sandbox.market,
      subdomain: sandbox.subdomain,
      theme: sandbox.theme,
    },
    "draft",
  );
  const templateConfig = deserializeTemplateConfig(
    resolved.theme as Record<string, string>,
  );
  const registerTemplate = getRegisterTemplate(sandbox.templateKey);
  const hrefPrefix = `/sandbox/${sandbox.shareId}`;
  const canonicalPath = canonicalSandboxPath(
    sandbox.shareId,
    pageKey,
    routeSlug,
  );

  return (
    <TenantInteractionShell
      colorSystemKey={templateConfig.colorSystem}
      pageInfo={{
        canonicalPath,
        pageDisabled: false,
        pageKey,
        pageNotSupported: false,
        routeSlug: routeSlug ?? null,
      }}
      templateConfig={templateConfig}
      templateKey={sandbox.templateKey}
      tenant={{
        companyName: sandbox.companyName,
        market: sandbox.market,
        subdomain: sandbox.subdomain,
      }}
    >
      <div className="min-h-screen bg-[color:var(--pk-background,#fff)]">
        {registerTemplate ? (
          <RegisterNav
            companyName={sandbox.companyName}
            currentPath={canonicalPath}
            hrefPrefix={hrefPrefix}
            templateKey={registerTemplate.key}
            tier={registerTemplate.tier}
          />
        ) : null}
        <main>
          {resolved.sections.map((section) =>
            renderSection(section, resolved.theme),
          )}
        </main>
        {registerTemplate ? (
          <RegisterFooter
            companyName={sandbox.companyName}
            hrefPrefix={hrefPrefix}
            templateKey={registerTemplate.key}
          />
        ) : null}
      </div>
    </TenantInteractionShell>
  );
}

export function createSandboxPageRoute(pageKey: string) {
  async function Page({
    params,
  }: SandboxPageRouteProps<{ shareId?: string; slug?: string }>) {
    const resolvedParams = (await params) ?? {};
    return renderSandboxPage({
      pageKey,
      routeSlug: resolvedParams.slug ?? null,
      shareId: resolvedParams.shareId ?? "",
    });
  }

  return {
    generateMetadata: generateSandboxPageMetadata,
    Page,
  };
}
