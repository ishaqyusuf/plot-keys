/**
 * Navigation configuration for the Noor (Agency) template family.
 */

import type { NavConfig } from "../../types";

export const noorNavConfig: NavConfig = {
  primary: [
    { label: "Home", href: "/" },
    { label: "Listings", href: "/listings" },
    { label: "Agents", href: "/agents", minTier: "plus" },
    { label: "Services", href: "/services", minTier: "plus" },
    { label: "Area Guides", href: "/areas", minTier: "plus" },
    { label: "Blog", href: "/blog", minTier: "pro" },
    { label: "Events", href: "/events", minTier: "pro" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  mobile: [
    { label: "Home", href: "/" },
    { label: "Listings", href: "/listings" },
    { label: "Agents", href: "/agents", minTier: "plus" },
    { label: "Services", href: "/services", minTier: "plus" },
    { label: "Area Guides", href: "/areas", minTier: "plus" },
    { label: "Blog", href: "/blog", minTier: "pro" },
    { label: "Events", href: "/events", minTier: "pro" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  ctaLabel: "Book a Viewing",
  ctaHref: "/contact",
};
