/**
 * Navigation configuration for the Bana (Developer) template family.
 */

import type { NavConfig } from "../../types";

export const banaNavConfig: NavConfig = {
  primary: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Gallery", href: "/gallery", minTier: "plus" },
    { label: "Services", href: "/services", minTier: "plus" },
    { label: "Investors", href: "/investors", minTier: "pro" },
    { label: "Blog", href: "/blog", minTier: "pro" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  mobile: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Gallery", href: "/gallery", minTier: "plus" },
    { label: "Services", href: "/services", minTier: "plus" },
    { label: "Investors", href: "/investors", minTier: "pro" },
    { label: "Blog", href: "/blog", minTier: "pro" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  ctaLabel: "View Projects",
  ctaHref: "/projects",
};
