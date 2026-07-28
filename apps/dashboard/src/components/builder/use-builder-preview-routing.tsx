"use client";

import type { RegistryLinkComponentProps } from "@plotkeys/section-registry";
import { useRouter, useSearchParams } from "next/navigation";
import type { MouseEvent } from "react";
import { useCallback } from "react";

type PreviewPageNavItem = {
  label: string;
  pageKey: string;
  slug: string;
};

type UseBuilderPreviewRoutingInput = {
  activePageKey: string;
  availablePages?: PreviewPageNavItem[];
  registryLinkMode: "page-query" | "raw";
};

function normalizeInternalHrefPath(href: string) {
  if (!href || href.startsWith("#")) return null;
  if (/^(mailto|tel|sms|javascript):/i.test(href)) return null;

  try {
    const url = new URL(href, "http://registry.local");
    if (url.origin !== "http://registry.local") return null;
    return url.pathname || "/";
  } catch {
    return null;
  }
}

export function useBuilderPreviewRouting({
  activePageKey,
  availablePages,
  registryLinkMode,
}: UseBuilderPreviewRoutingInput) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const resolvePreviewPage = useCallback(
    (href: string, pageKey?: string) => {
      const hrefPath = normalizeInternalHrefPath(href);
      const hrefPage = hrefPath
        ? availablePages?.find((page) => page.slug === hrefPath)
        : undefined;

      if (hrefPage) return hrefPage;
      if (!pageKey || pageKey === activePageKey) return null;

      return availablePages?.find((page) => page.pageKey === pageKey) ?? null;
    },
    [activePageKey, availablePages],
  );

  const buildPreviewPageHref = useCallback(
    (page: PreviewPageNavItem) => {
      const params = new URLSearchParams(searchParams.toString());

      if (page.slug === "/" || page.pageKey === "home") {
        params.delete("page");
        params.delete("path");
      } else {
        params.set("page", page.pageKey);
        params.set("path", page.slug);
      }

      const query = params.toString();
      return query ? `?${query}` : "?";
    },
    [searchParams],
  );

  const resolvePreviewLinkHref = useCallback(
    (href: string, pageKey?: string) => {
      if (registryLinkMode !== "page-query") return href;

      const targetPage = resolvePreviewPage(href, pageKey);
      return targetPage ? buildPreviewPageHref(targetPage) : href;
    },
    [buildPreviewPageHref, registryLinkMode, resolvePreviewPage],
  );

  const handlePageNav = useCallback(
    (page: PreviewPageNavItem) => {
      const params = new URLSearchParams(window.location.search);
      if (page.slug === "/" || page.pageKey === "home") {
        params.delete("page");
        params.delete("path");
      } else {
        params.set("page", page.pageKey);
        params.set("path", page.slug);
      }
      router.push(`?${params.toString()}`);
    },
    [router],
  );

  const handlePreviewLinkClick = useCallback(
    (href: string, event: MouseEvent<HTMLAnchorElement>, pageKey?: string) => {
      const targetPage = resolvePreviewPage(href, pageKey);
      if (!targetPage) return;

      event.preventDefault();
      handlePageNav(targetPage);
    },
    [handlePageNav, resolvePreviewPage],
  );

  function PreviewRegistryLink({
    children,
    href,
    onClick,
    page,
    ...props
  }: RegistryLinkComponentProps) {
    const resolvedHref = resolvePreviewLinkHref(href, page);

    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handlePreviewLinkClick(href, event, page);
    }

    return (
      <a href={resolvedHref} {...props} onClick={handleClick}>
        {children}
      </a>
    );
  }

  return {
    handlePageNav,
    handlePreviewLinkClick,
    PreviewRegistryLink,
    resolvePreviewLinkHref,
  };
}
