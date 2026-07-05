import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link } from "../../../../components/Link";

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
  return (
    <Link href={riwaqRoutes[page]} page={page} {...props}>
      {children}
    </Link>
  );
}
