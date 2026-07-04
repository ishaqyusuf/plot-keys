import type { FooterConfig } from "../../types";

export const riwaqFooterConfig: FooterConfig = {
  groups: [
    {
      heading: "Site",
      links: [
        { href: "/", label: "Home" },
        { href: "/roadmap", label: "Roadmap" },
        { href: "/blog", label: "Blog" },
        { href: "/contact", label: "Contact" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { href: "/privacy", label: "Privacy" },
        { href: "/terms", label: "Terms" },
      ],
    },
  ],
  tagline:
    "A focused real-estate starter template for publishing trust, project history, and contact paths.",
};
