/**
 * Footer configuration for the Sakan (Rental) template family.
 */

import type { FooterConfig } from "../../types";

export const sakanFooter: FooterConfig = {
  groups: [
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      heading: "Rentals",
      links: [
        { label: "All Rentals", href: "/rentals" },
        { label: "Saved Listings", href: "/portal/saved" },
        { label: "How It Works", href: "/how-it-works" },
      ],
    },
    {
      heading: "Landlords",
      links: [
        { label: "List Property", href: "/landlords" },
        { label: "Landlord Guide", href: "/landlords" },
        { label: "Tenant Resources", href: "/tenant-resources" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ],
  tagline:
    "Quality rental homes — connecting tenants with well-managed properties across Nigeria.",
};
