/**
 * Navigation configuration for the Faris (Solo) template family.
 * Personal agent brand — warm, accessible nav with personal consultation CTA.
 */

import type { NavConfig } from "../../types";

export const farisNavConfig: NavConfig = {
  primary: [
    { label: "Home", href: "/" },
    { label: "Listings", href: "/listings" },
    { label: "Services", href: "/services", minTier: "plus" },
    { label: "Testimonials", href: "/testimonials", minTier: "plus" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog", minTier: "pro" },
    { label: "Saved Listings", href: "/saved", authRequired: true, minTier: "plus" },
  ],
  mobile: [
    { label: "Home", href: "/" },
    { label: "Listings", href: "/listings" },
    { label: "Services", href: "/services", minTier: "plus" },
    { label: "Testimonials", href: "/testimonials", minTier: "plus" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog", minTier: "pro" },
    { label: "Saved Listings", href: "/saved", authRequired: true, minTier: "plus" },
  ],
  ctaLabel: "Book a Consultation",
  ctaHref: "/contact",
};
