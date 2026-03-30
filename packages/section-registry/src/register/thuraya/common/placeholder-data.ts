import type { PlaceholderData } from "../../types";

export const thurayaPlaceholderData: PlaceholderData = {
  listings: [
    {
      id: "thuraya-listing-1",
      title: "6 Bed Waterfront Mansion",
      location: "Banana Island, Lagos",
      price: "₦450,000,000",
      specs: "6 bed · 7 bath · 1,400 sqm",
      slug: "6-bed-waterfront-mansion-banana-island",
      imageUrl: undefined,
    },
    {
      id: "thuraya-listing-2",
      title: "4 Bed Penthouse",
      location: "Ikoyi, Lagos",
      price: "₦280,000,000",
      specs: "4 bed · 5 bath · 650 sqm",
      slug: "4-bed-penthouse-ikoyi",
      imageUrl: undefined,
    },
    {
      id: "thuraya-listing-3",
      title: "5 Bed Villa",
      location: "Maitama, Abuja",
      price: "₦320,000,000",
      specs: "5 bed · 6 bath · 920 sqm",
      slug: "5-bed-villa-maitama-abuja",
      imageUrl: undefined,
    },
  ],

  agents: [
    {
      id: "thuraya-agent-1",
      name: "Adaeze Nwosu",
      role: "Senior Luxury Consultant",
      bio: "Adaeze brings over fourteen years of experience advising high-net-worth individuals on premier residential acquisitions across Lagos Island. Her discreet approach and deep market knowledge make her the trusted choice for Banana Island and Ikoyi transactions.",
      slug: "adaeze-nwosu",
      photoUrl: undefined,
    },
    {
      id: "thuraya-agent-2",
      name: "Femi Adeyinka",
      role: "Head of Private Sales, Abuja",
      bio: "Femi leads our Abuja division with a focus on diplomatic and investment-grade residential properties in Maitama and Asokoro. A respected figure in the luxury market, he has facilitated some of the capital's most significant private sales.",
      slug: "femi-adeyinka",
      photoUrl: undefined,
    },
  ],

  testimonials: [
    {
      id: "thuraya-testimonial-1",
      quote:
        "The team handled every aspect of our acquisition with extraordinary discretion and professionalism. We were presented only with properties that genuinely matched our brief — no wasted viewings, no noise.",
      author: "A.O.",
      role: "Private Client — Banana Island",
    },
    {
      id: "thuraya-testimonial-2",
      quote:
        "Thuraya's knowledge of the Ikoyi market is unmatched. They understood precisely what we were looking for before we had fully articulated it ourselves. The result exceeded every expectation.",
      author: "T.B.",
      role: "Private Client — Ikoyi",
    },
    {
      id: "thuraya-testimonial-3",
      quote:
        "From initial consultation to final handover, the standard of service was impeccable. I would not consider working with another firm for property of this calibre.",
      author: "C.E.",
      role: "Private Client — Maitama, Abuja",
    },
  ],

  services: [
    {
      id: "thuraya-service-1",
      title: "Exclusive Listings",
      description:
        "Access to off-market and exclusive residential properties not available through public channels — presented only to qualified, pre-vetted clients.",
    },
    {
      id: "thuraya-service-2",
      title: "Private Sales",
      description:
        "Discreet representation for sellers who require confidentiality, speed, and the highest possible outcome without public exposure.",
    },
    {
      id: "thuraya-service-3",
      title: "Investment Advisory",
      description:
        "Strategic guidance on luxury residential investment — acquisition structuring, portfolio diversification, and long-term asset positioning in Nigeria's prime markets.",
    },
  ],
};
