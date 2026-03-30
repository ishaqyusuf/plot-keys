/**
 * Navigation configuration for the Sakan (Rental) template family.
 * Rental-first — tenant acquisition focus.
 */

import type { NavConfig } from "../../types";

export const sakanNav: NavConfig = {
  primary: [
    { label: "Home", href: "/" },
    { label: "Rentals", href: "/rentals" },
    { label: "Services", href: "/services", minTier: "plus" },
    { label: "How It Works", href: "/how-it-works", minTier: "plus" },
    { label: "FAQ", href: "/faq", minTier: "plus" },
    {
      label: "Saved Listings",
      href: "/portal/saved",
      minTier: "plus",
      authRequired: true,
    },
    { label: "Landlords", href: "/landlords", minTier: "pro" },
    { label: "Tenant Resources", href: "/tenant-resources", minTier: "pro" },
    { label: "Blog", href: "/blog", minTier: "pro" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  mobile: [
    { label: "Home", href: "/" },
    { label: "Rentals", href: "/rentals" },
    { label: "Services", href: "/services", minTier: "plus" },
    { label: "How It Works", href: "/how-it-works", minTier: "plus" },
    { label: "FAQ", href: "/faq", minTier: "plus" },
    {
      label: "Saved Listings",
      href: "/portal/saved",
      minTier: "plus",
      authRequired: true,
    },
    { label: "Landlords", href: "/landlords", minTier: "pro" },
    { label: "Tenant Resources", href: "/tenant-resources", minTier: "pro" },
    { label: "Blog", href: "/blog", minTier: "pro" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  ctaLabel: "Find a Rental",
  ctaHref: "/rentals",
};
