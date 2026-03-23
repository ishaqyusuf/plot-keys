/**
 * Footer configuration for the Bana (Developer) template family.
 */

import type { FooterConfig } from "../../types";

export const banaFooterConfig: FooterConfig = {
  groups: [
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      heading: "Projects",
      links: [
        { label: "All Projects", href: "/projects" },
        { label: "Project Detail", href: "/projects" },
      ],
    },
    {
      heading: "Invest",
      links: [
        { label: "Investors", href: "/investors" },
        { label: "Blog", href: "/blog" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ],
  tagline:
    "Building landmark properties and delivering investor-grade developments across Nigeria.",
};
