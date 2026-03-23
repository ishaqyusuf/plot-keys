/**
 * Footer configuration for the Wafi (Manager) template family.
 */

import type { FooterConfig } from "../../types";

export const wafiFooterConfig: FooterConfig = {
  groups: [
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      heading: "Services",
      links: [
        { label: "Property Management", href: "/services#property-management" },
        { label: "Tenant Screening", href: "/services#tenant-screening" },
        { label: "Maintenance", href: "/services#maintenance" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: "Landlords", href: "/landlords" },
        { label: "Tenants", href: "/tenants" },
        { label: "Blog", href: "/blog" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ],
  tagline:
    "Trustworthy property management — connecting landlords and tenants across Nigeria.",
};
