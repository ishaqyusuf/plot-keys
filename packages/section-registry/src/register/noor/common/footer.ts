/**
 * Footer configuration for the Noor (Agency) template family.
 */

import type { FooterConfig } from "../../types";

export const noorFooterConfig: FooterConfig = {
  groups: [
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Agents", href: "/agents" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      heading: "Properties",
      links: [
        { label: "Listings", href: "/listings" },
        { label: "Area Guides", href: "/areas" },
        { label: "Saved Listings", href: "/portal/saved" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "FAQ", href: "/faq" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ],
  tagline:
    "Connecting families and investors with the right property across Nigeria.",
};
