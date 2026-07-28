"use client";

import {
  ClickGuardProvider,
  deserializeTemplateConfig,
  getRegisterTemplate,
  InlineOverview,
  PreviewBanner,
  type RegistryLinkComponentProps,
  RegistryProvider,
  resolvePage,
  resolveTemplatePageHandle,
} from "@plotkeys/section-registry";
import {
  PreviewRegisterShell,
  type SandboxPreviewRoute,
  type SandboxProfileRenderData,
} from "@plotkeys/website-builder";
import type { JSX } from "react";

type Props = {
  data: SandboxProfileRenderData & {
    mode: "draft" | "live";
    route: SandboxPreviewRoute;
  };
};

function scopedPreviewHref(
  href: string,
  shareId: string,
  mode: "draft" | "live",
) {
  if (
    !href ||
    href.startsWith("#") ||
    /^(https?:|mailto:|tel:|sms:)/i.test(href)
  ) {
    return href;
  }

  const pathname = href.startsWith("/") ? href : `/${href}`;
  const prefix = `/preview/${encodeURIComponent(shareId)}`;
  const url = new URL(
    pathname === "/" ? prefix : `${prefix}${pathname}`,
    "http://sandbox.local",
  );
  url.searchParams.set("mode", mode);
  return `${url.pathname}${url.search}`;
}

export function SandboxPublicPreview({ data }: Props) {
  const resolved = resolvePage(
    data.templateKey,
    data.route.pageKey,
    {
      companyName: data.companyName,
      content: data.content,
      currentBlogPost: data.currentBlogPost,
      liveAgents: data.liveAgents,
      liveBlogPosts: data.liveBlogPosts,
      liveListings: data.liveListings,
      market: data.market,
      subdomain: data.subdomain,
      theme: data.theme,
    },
    data.mode,
  );
  const templateConfig = deserializeTemplateConfig(
    resolved.theme as Record<string, string>,
  );
  const registerTemplate = getRegisterTemplate(data.templateKey);
  const pageInfo = {
    canonicalPath: data.route.canonicalPath,
    pageDisabled: false,
    pageKey: data.route.pageKey,
    pageNotSupported: false,
    routeSlug: data.route.routeSlug,
  };
  const templatePageHandle = resolveTemplatePageHandle<
    Record<string, never> | { slug: string }
  >({
    pageInfo,
    pageKey: data.route.pageKey,
    templateKey: data.templateKey,
  });
  const TemplatePage = templatePageHandle?.Page as
    | ((props: { slug?: string }) => JSX.Element | null)
    | undefined;

  function SandboxLink({
    children,
    href,
    page: _page,
    ...props
  }: RegistryLinkComponentProps) {
    return (
      <a href={scopedPreviewHref(href, data.shareId, data.mode)} {...props}>
        {children}
      </a>
    );
  }

  const page = TemplatePage ? (
    <TemplatePage
      {...(data.route.routeSlug ? { slug: data.route.routeSlug } : {})}
    />
  ) : (
    <main>
      {resolved.sections.map((section) => {
        const Section = section.component as (props: {
          config: typeof section.config;
          theme: typeof resolved.theme;
        }) => JSX.Element;
        return (
          <Section
            config={section.config}
            key={section.id}
            theme={resolved.theme}
          />
        );
      })}
    </main>
  );

  return (
    <RegistryProvider
      colorSystemKey={templateConfig.colorSystem}
      content={data.content}
      linkComponent={SandboxLink}
      pageInfo={templatePageHandle?.info ?? pageInfo}
      renderMode={data.mode}
      templateConfig={templateConfig}
      templateKey={data.templateKey}
      tenant={{
        companyName: data.companyName,
        market: data.market,
        subdomain: data.subdomain,
      }}
    >
      <ClickGuardProvider>
        <PreviewBanner />
        {registerTemplate ? (
          <PreviewRegisterShell
            companyName={data.companyName}
            currentPath={data.route.canonicalPath}
            templateConfig={templateConfig}
            templateKey={registerTemplate.key}
            tier={registerTemplate.tier}
            onLinkClick={() => undefined}
            resolveLinkHref={(href) =>
              scopedPreviewHref(href, data.shareId, data.mode)
            }
          >
            {page}
          </PreviewRegisterShell>
        ) : (
          <div className="min-h-screen bg-[color:var(--pk-background,#fff)]">
            {page}
          </div>
        )}
        <InlineOverview />
      </ClickGuardProvider>
    </RegistryProvider>
  );
}
