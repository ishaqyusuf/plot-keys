/**
 * Navigation configuration for the Wafi (Manager) template family.
 */

import type { NavConfig } from "../../types";

export const wafiNavConfig: NavConfig = {
  primary: [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "Services", href: "/services", minTier: "plus" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq", minTier: "plus" },
    { label: "Contact", href: "/contact" },
    { label: "Landlords", href: "/landlords", minTier: "pro" },
    { label: "Tenants", href: "/tenants", minTier: "pro" },
    { label: "Blog", href: "/blog", minTier: "pro" },
    {
      label: "Saved Listings",
      href: "/portal/saved",
      authRequired: true,
      minTier: "plus",
    },
  ],
  mobile: [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "Services", href: "/services", minTier: "plus" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq", minTier: "plus" },
    { label: "Contact", href: "/contact" },
    { label: "Landlords", href: "/landlords", minTier: "pro" },
    { label: "Tenants", href: "/tenants", minTier: "pro" },
    { label: "Blog", href: "/blog", minTier: "pro" },
    {
      label: "Saved Listings",
      href: "/portal/saved",
      authRequired: true,
      minTier: "plus",
    },
  ],
  ctaLabel: "List Your Property",
  ctaHref: "/contact",
};
