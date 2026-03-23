import type { FooterConfig } from "../../types";

export const thurayaFooter: FooterConfig = {
  groups: [
    {
      heading: "Thuraya",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Press", href: "/press" },
      ],
    },
    {
      heading: "Portfolio",
      links: [
        { label: "All Properties", href: "/portfolio" },
        { label: "Private Sales", href: "/private-sales" },
        { label: "Area Guides", href: "/areas" },
      ],
    },
    {
      heading: "Intelligence",
      links: [
        { label: "Insights", href: "/insights" },
        { label: "Market Reports", href: "/insights" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ],
  tagline:
    "Curated luxury properties — discretion, expertise, and uncompromising standards.",
};
