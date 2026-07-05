"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useRegistry, useRegistryLinkComponent } from "../runtime-context";

export type RegistryTemplateLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  children: ReactNode;
  href: string;
  page?: string;
};

export function Link({
  children,
  href,
  page: pageKey,
  ...props
}: RegistryTemplateLinkProps) {
  const registry = useRegistry();
  const LinkComponent = useRegistryLinkComponent();
  const resolvedPageKey = pageKey ?? registry.page.pageKey;

  return (
    <LinkComponent href={href} page={resolvedPageKey} {...props}>
      {children}
    </LinkComponent>
  );
}
