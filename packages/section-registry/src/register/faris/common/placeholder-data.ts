/**
 * Placeholder data for the Faris (Solo) template family.
 * Used in "template" browse mode only — never stored for real tenants.
 *
 * Note: No placeholder agents — Faris IS the agent. No agent showcase needed.
 */

import type { PlaceholderData } from "../../types";

export const farisPlaceholderData: PlaceholderData = {
  listings: [
    {
      id: "faris-listing-1",
      title: "3 Bed Apartment — Oniru Estate",
      location: "Oniru Estate, Victoria Island, Lagos",
      price: "₦85,000,000",
      specs: "3 bed · 2 bath · 180 sqm",
      slug: "3-bed-apartment-oniru-estate",
      imageUrl: undefined,
    },
    {
      id: "faris-listing-2",
      title: "4 Bed Semi-Detached Duplex — Lekki Phase 1",
      location: "Lekki Phase 1, Lagos",
      price: "₦145,000,000",
      specs: "4 bed · 4 bath · 320 sqm",
      slug: "4-bed-duplex-lekki-phase-1",
      imageUrl: undefined,
    },
    {
      id: "faris-listing-3",
      title: "2 Bed Apartment — Yaba",
      location: "Yaba, Lagos Mainland",
      price: "₦42,000,000",
      specs: "2 bed · 2 bath · 110 sqm",
      slug: "2-bed-apartment-yaba",
      imageUrl: undefined,
    },
  ],

  services: [
    {
      id: "faris-service-1",
      title: "Buyer Representation",
      description:
        "I guide buyers through every stage — from brief to keys in hand. You get honest shortlisting, negotiation support, and due diligence coordination so you never overpay or overlook a red flag.",
    },
    {
      id: "faris-service-2",
      title: "Seller Advisory",
      description:
        "Strategic pricing, targeted marketing, and personal follow-through on every enquiry. I work to achieve the best outcome for your property without cutting corners on presentation or process.",
    },
    {
      id: "faris-service-3",
      title: "Investment Consulting",
      description:
        "Whether you're building a portfolio or making your first investment, I provide market intelligence and honest projections to help you make confident, data-informed property decisions.",
    },
  ],

  testimonials: [
    {
      id: "faris-testimonial-1",
      quote:
        "Faris helped us find our dream home in three weeks. He listened carefully to what we needed, showed us only properties that genuinely matched, and negotiated a price we didn't think was possible. Couldn't recommend him more.",
      author: "Tunde and Bisi Afolabi",
      role: "First-time Buyers, Lekki",
    },
    {
      id: "faris-testimonial-2",
      quote:
        "I've sold two properties through Faris and the experience has been seamless both times. He keeps you informed, handles everything professionally, and always has your best interests in mind — not just a quick sale.",
      author: "Ifeoma Okafor",
      role: "Repeat Seller, Victoria Island",
    },
    {
      id: "faris-testimonial-3",
      quote:
        "As an investor, I need an agent who understands yield and capital growth — not just aesthetics. Faris speaks that language fluently. His advice on my Yaba acquisition has already proven accurate.",
      author: "Emeka Chibueze",
      role: "Property Investor, Lagos",
    },
    {
      id: "faris-testimonial-4",
      quote:
        "We relocated from Port Harcourt with no contacts in Lagos. Faris made the whole process stress-free — he handled viewings, liaised with the lawyers, and we were settled in within six weeks. Exceptional service.",
      author: "Grace and Michael Onyia",
      role: "Relocation Buyers, Oniru",
    },
  ],
};
