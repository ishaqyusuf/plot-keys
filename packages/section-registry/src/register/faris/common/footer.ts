/**
 * Footer configuration for the Faris (Solo) template family.
 */

import type { FooterConfig } from "../../types";

export const farisFooterConfig: FooterConfig = {
  groups: [
    {
      heading: "[Agent Name]",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      heading: "Properties",
      links: [
        { label: "Listings", href: "/listings" },
        { label: "Saved Listings", href: "/saved" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: "Services", href: "/services" },
        { label: "Blog", href: "/blog" },
        { label: "Testimonials", href: "/testimonials" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ],
  tagline:
    "Your trusted real estate consultant — helping families and investors make confident property decisions.",
};
