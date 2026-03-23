/**
 * Placeholder data for the Wafi (Manager) template family.
 * Used in "template" browse mode only — never stored for real tenants.
 */

import type { PlaceholderData } from "../../types";

export const wafiPlaceholderData: PlaceholderData = {
  listings: [
    {
      id: "wafi-listing-1",
      title: "2 Bed Apartment — Victoria Island",
      location: "Victoria Island, Lagos",
      price: "₦2,500,000/yr",
      specs: "2 bed · 2 bath · 95 sqm",
      slug: "2-bed-apartment-victoria-island",
      imageUrl: undefined,
    },
    {
      id: "wafi-listing-2",
      title: "3 Bed Flat — Maitama, Abuja",
      location: "Maitama, Abuja",
      price: "₦3,800,000/yr",
      specs: "3 bed · 3 bath · 140 sqm",
      slug: "3-bed-flat-maitama-abuja",
      imageUrl: undefined,
    },
    {
      id: "wafi-listing-3",
      title: "Studio Apartment — Lekki Phase 1",
      location: "Lekki Phase 1, Lagos",
      price: "₦1,200,000/yr",
      specs: "Studio · 1 bath · 45 sqm",
      slug: "studio-apartment-lekki-phase-1",
      imageUrl: undefined,
    },
  ],

  services: [
    {
      id: "wafi-service-1",
      title: "Property Management",
      description:
        "End-to-end management of your residential or commercial property — rent collection, reporting, and day-to-day operations handled for you.",
    },
    {
      id: "wafi-service-2",
      title: "Tenant Screening",
      description:
        "Rigorous background and credit checks, employment verification, and reference calls so only reliable tenants occupy your property.",
    },
    {
      id: "wafi-service-3",
      title: "Maintenance Coordination",
      description:
        "We coordinate repairs and scheduled maintenance with vetted contractors, keeping your property in excellent condition year-round.",
    },
  ],

  testimonials: [
    {
      id: "wafi-testimonial-1",
      quote:
        "Wafi has managed my four units in Lagos for two years. Rent is always on time and I've never had to chase a tenant myself. Completely stress-free.",
      author: "Chukwuemeka Obi",
      role: "Landlord, Victoria Island",
    },
    {
      id: "wafi-testimonial-2",
      quote:
        "As a tenant, dealing with Wafi is a breath of fresh air. Maintenance requests are handled within 48 hours and the team is always reachable.",
      author: "Amina Suleiman",
      role: "Tenant, Maitama, Abuja",
    },
    {
      id: "wafi-testimonial-3",
      quote:
        "I was worried about renting out my property while living abroad. Wafi gave me peace of mind — detailed monthly reports and zero headaches.",
      author: "Ngozi Eze",
      role: "Overseas Landlord, Lekki",
    },
  ],
};
