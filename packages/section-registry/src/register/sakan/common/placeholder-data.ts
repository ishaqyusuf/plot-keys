/**
 * Placeholder data for the Sakan (Rental) template family.
 * Used in "template" browse mode only — never stored against a real tenant.
 * Rental listings, services, and tenant/landlord testimonials.
 */

import type { PlaceholderData } from "../../types";

export const sakanPlaceholderData: PlaceholderData = {
  listings: [
    {
      id: "sakan-listing-1",
      title: "2 Bed Flat",
      location: "Yaba, Lagos",
      price: "₦1,800,000/yr",
      specs: "2 bed · 2 bath · 95 sqm",
      slug: "2-bed-flat-yaba-lagos",
      imageUrl: undefined,
    },
    {
      id: "sakan-listing-2",
      title: "3 Bed Terrace",
      location: "Gwarinpa, Abuja",
      price: "₦2,200,000/yr",
      specs: "3 bed · 3 bath · 145 sqm",
      slug: "3-bed-terrace-gwarinpa-abuja",
      imageUrl: undefined,
    },
    {
      id: "sakan-listing-3",
      title: "Studio Apartment",
      location: "Lekki Phase 1, Lagos",
      price: "₦1,200,000/yr",
      specs: "Studio · 1 bath · 42 sqm",
      slug: "studio-lekki-phase-1",
      imageUrl: undefined,
    },
  ],

  services: [
    {
      id: "sakan-service-1",
      title: "Rental Management",
      description:
        "End-to-end management of your rental property — rent collection, maintenance coordination, tenant communications, and annual reviews handled by our dedicated team.",
    },
    {
      id: "sakan-service-2",
      title: "Tenant Placement",
      description:
        "We find and vet quality tenants for your property, handling listings, viewings, reference checks, and tenancy agreements so you can let with confidence.",
    },
    {
      id: "sakan-service-3",
      title: "Property Maintenance",
      description:
        "Responsive maintenance support for tenants and landlords alike — from minor repairs to full refurbishments, coordinated through our vetted contractor network.",
    },
  ],

  testimonials: [
    {
      id: "sakan-testimonial-1",
      quote:
        "Finding a flat in Lagos usually means weeks of stress and unreliable agents. Sakan was different from the start — responsive, transparent, and the property was exactly as described. I moved in within two weeks.",
      author: "Blessing Okeke",
      role: "Tenant — Yaba, Lagos",
    },
    {
      id: "sakan-testimonial-2",
      quote:
        "I have two properties managed by Sakan and the difference from doing it myself is night and day. Rent arrives on time, maintenance issues are resolved quickly, and I barely need to get involved.",
      author: "Abdullahi Musa",
      role: "Landlord — Gwarinpa, Abuja",
    },
    {
      id: "sakan-testimonial-3",
      quote:
        "As someone relocating from Port Harcourt, I needed a team I could trust remotely. Sakan handled my property search professionally and I had a signed tenancy before I even arrived in Lagos.",
      author: "Chinyere Eze",
      role: "Tenant — Lekki Phase 1, Lagos",
    },
  ],
};
