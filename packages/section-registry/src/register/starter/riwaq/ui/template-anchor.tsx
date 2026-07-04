import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useRegistryLinkComponent } from "../../../../runtime-context";

export type RiwaqPageKey = "blog" | "contact" | "home" | "roadmap";

const riwaqRoutes: Record<RiwaqPageKey, string> = {
  blog: "/blog",
  contact: "/contact",
  home: "/",
  roadmap: "/roadmap",
};

export type RiwaqTemplateAnchorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  children: ReactNode;
  page: RiwaqPageKey;
};

export function RiwaqTemplateAnchor({
  children,
  page,
  ...props
}: RiwaqTemplateAnchorProps) {
  const LinkComponent = useRegistryLinkComponent();

  return (
    <LinkComponent href={riwaqRoutes[page]} {...props}>
      {children}
    </LinkComponent>
  );
}
