import type { NavConfig } from "../../types";

export const thurayaNav: NavConfig = {
  primary: [
    { label: "Home", href: "/" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Services", href: "/services", minTier: "plus" },
    { label: "Area Guides", href: "/areas", minTier: "plus" },
    {
      label: "Saved Listings",
      href: "/portal/saved",
      minTier: "plus",
      authRequired: true,
    },
    { label: "Private Sales", href: "/private-sales", minTier: "pro" },
    { label: "Insights", href: "/insights", minTier: "pro" },
    { label: "Press", href: "/press", minTier: "pro" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  mobile: [
    { label: "Home", href: "/" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Services", href: "/services", minTier: "plus" },
    { label: "Area Guides", href: "/areas", minTier: "plus" },
    {
      label: "Saved Listings",
      href: "/portal/saved",
      minTier: "plus",
      authRequired: true,
    },
    { label: "Private Sales", href: "/private-sales", minTier: "pro" },
    { label: "Insights", href: "/insights", minTier: "pro" },
    { label: "Press", href: "/press", minTier: "pro" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  ctaLabel: "Private Consultation",
  ctaHref: "/contact",
};
