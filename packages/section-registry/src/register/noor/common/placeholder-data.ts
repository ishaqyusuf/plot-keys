import type { PlaceholderData } from "../../types";

export const noorPlaceholderData: PlaceholderData = {
  listings: [
    {
      id: "listing-1",
      imageUrl: undefined,
      location: "Banana Island, Ikoyi, Lagos",
      price: "₦450,000,000",
      slug: "4-bed-detached-banana-island",
      specs: "4 Beds · 4 Baths · 620 sqm",
      title: "4 Bed Detached Duplex",
    },
    {
      id: "listing-2",
      imageUrl: undefined,
      location: "Lekki Phase 1, Lagos",
      price: "₦120,000,000",
      slug: "3-bed-terrace-lekki-phase-1",
      specs: "3 Beds · 3 Baths · 280 sqm",
      title: "3 Bed Terrace House",
    },
    {
      id: "listing-3",
      imageUrl: undefined,
      location: "Maitama, Abuja",
      price: "₦85,000,000",
      slug: "2-bed-apartment-maitama",
      specs: "2 Beds · 2 Baths · 140 sqm",
      title: "2 Bed Luxury Apartment",
    },
  ],

  agents: [
    {
      bio: "Chidinma has 8 years of experience in Lagos residential sales, specialising in high-end properties across Ikoyi and Lekki.",
      id: "agent-1",
      name: "Chidinma Okafor",
      photoUrl: undefined,
      role: "Senior Sales Agent",
      slug: "chidinma-okafor",
    },
    {
      bio: "Emeka leads our Abuja branch, with a decade of experience in commercial and residential property transactions across the FCT.",
      id: "agent-2",
      name: "Emeka Nwosu",
      photoUrl: undefined,
      role: "Branch Manager — Abuja",
      slug: "emeka-nwosu",
    },
    {
      bio: "Fatimah specialises in investment advisory, helping clients build diversified real estate portfolios across Nigeria.",
      id: "agent-3",
      name: "Fatimah Bello",
      photoUrl: undefined,
      role: "Investment Advisor",
      slug: "fatimah-bello",
    },
  ],

  testimonials: [
    {
      author: "Adaeze Ibe",
      id: "testimonial-1",
      quote:
        "Noor Properties made buying our first home a genuinely stress-free experience. Chidinma guided us through every step and we found our dream home in Lekki within three weeks.",
      role: "First-time Buyer, Lagos",
    },
    {
      author: "Olumide Adeyemi",
      id: "testimonial-2",
      quote:
        "I've worked with several agencies over the years and Noor is by far the most professional. Their market data is accurate and their agents actually listen to what you need.",
      role: "Property Investor",
    },
    {
      author: "Ngozi Chukwu",
      id: "testimonial-3",
      quote:
        "We relocated from London and had no idea where to start. The Noor team handled everything remotely and had us in our new Maitama apartment within two months. Outstanding service.",
      role: "Returning Diaspora Buyer",
    },
  ],

  services: [
    {
      description:
        "Full-service residential and commercial property sales across Nigeria's major cities, with expert agents handling every step from listing to completion.",
      id: "service-1",
      title: "Property Sales",
    },
    {
      description:
        "Data-driven investment advisory helping individuals and institutions identify high-yield real estate opportunities across Lagos, Abuja, and Port Harcourt.",
      id: "service-2",
      title: "Investment Advisory",
    },
    {
      description:
        "Detailed market research reports covering price trends, neighbourhood analysis, and development forecasts to inform your property decisions.",
      id: "service-3",
      title: "Market Research",
    },
  ],
};
