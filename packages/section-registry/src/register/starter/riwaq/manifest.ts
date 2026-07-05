import type {
  RegisterPageDefinition,
  RegisterSectionSlot,
  TemplatePlanVariant,
} from "../../types";
import { riwaqContentSchema, riwaqDefaultContent } from "./content";
import { riwaqFooterConfig } from "./footer";
import { riwaqNavConfig } from "./nav";
import { riwaqPlaceholderData } from "./placeholder-data";

function slot(
  id: string,
  label: string,
  sectionType: string,
  sortOrder: number,
  contentKeys: string[] = [],
  options: Partial<
    Pick<
      RegisterSectionSlot,
      "dataSource" | "defaultEnabled" | "requiredResources"
    >
  > = {},
): RegisterSectionSlot {
  return {
    contentKeys,
    defaultEnabled: options.defaultEnabled ?? true,
    id,
    label,
    sectionType,
    sortOrder,
    ...(options.dataSource ? { dataSource: options.dataSource } : {}),
    ...(options.requiredResources
      ? { requiredResources: options.requiredResources }
      : {}),
  };
}

const hero = slot("hero", "Hero", "HeroBannerSection", 10, [
  "hero.eyebrow",
  "hero.title",
  "hero.subtitle",
  "hero.ctaText",
  "hero.secondaryCtaText",
  "hero.searchEyebrow",
  "hero.searchTitle",
  "hero.searchMode1",
  "hero.searchMode2",
  "hero.searchMode3",
  "hero.searchLocationLabel",
  "hero.searchLocationValue",
  "hero.searchTypeLabel",
  "hero.searchTypeValue",
  "hero.searchBudgetLabel",
  "hero.searchBudgetValue",
  "hero.searchButton",
  "hero.badgeEyebrow",
  "hero.badgeTitle",
  "hero.badgeMeta",
  "media.heroImage",
  "media.detailImage",
]);

const blogHero = slot("blog-hero", "Blog Header", "HeroBannerSection", 10, [
  "blog.eyebrow",
  "blog.title",
  "blog.subtitle",
]);

const contactHero = slot(
  "contact-hero",
  "Contact Header",
  "HeroBannerSection",
  10,
  ["contact.eyebrow", "contact.title", "contact.subtitle"],
);

const roadmapHero = slot(
  "roadmap-hero",
  "Roadmap Header",
  "HeroBannerSection",
  10,
  ["roadmap.eyebrow", "roadmap.title", "roadmap.subtitle"],
);

const marketStats = slot("market-stats", "Market Stats", "MarketStatsSection", 20, [
  "marketStats.stat1Label",
  "marketStats.stat1Value",
  "marketStats.stat2Label",
  "marketStats.stat2Value",
  "marketStats.stat3Label",
  "marketStats.stat3Value",
]);

const story = slot("story", "Story", "StoryGridSection", 30, [
  "story.eyebrow",
  "story.cardEyebrow",
  "story.heading",
  "story.body",
  "story.ctaLabel",
]);

const roadmap = slot(
  "roadmap-timeline",
  "Roadmap Timeline",
  "RiwaqRoadmapTimelineSection",
  40,
  [
    "roadmap.eyebrow",
    "roadmap.title",
    "roadmap.subtitle",
    "roadmap.item1.year",
    "roadmap.item1.title",
    "roadmap.item1.body",
    "roadmap.item2.year",
    "roadmap.item2.title",
    "roadmap.item2.body",
    "roadmap.item3.year",
    "roadmap.item3.title",
    "roadmap.item3.body",
  ],
);

const blogList = slot("blog-list", "Blog", "BlogListSection", 30, [], {
  dataSource: "blog_posts",
});

const contact = slot("contact", "Contact", "ContactSection", 50, [
  "contact.email",
  "contact.phone",
  "contact.address",
  "contact.whatsapp",
  "contact.eyebrow",
  "contact.title",
  "contact.subtitle",
  "contact.form.emailLabel",
  "contact.form.emailPlaceholder",
  "contact.form.messageLabel",
  "contact.form.messagePlaceholder",
  "contact.form.submitLabel",
]);

const cta = slot("cta", "CTA", "CtaBandSection", 60, [
  "cta.heading",
  "cta.subheading",
  "cta.ctaLabel",
]);

const pages: RegisterPageDefinition[] = [
  {
    label: "Landing",
    pageKey: "home",
    sections: [hero, marketStats, story, roadmap, contact, cta],
    slug: "/",
  },
  {
    label: "Blog",
    pageKey: "blog",
    sections: [blogHero, blogList, cta],
    slug: "/blog",
  },
  {
    label: "Contact",
    pageKey: "contact",
    sections: [contactHero, contact, cta],
    slug: "/contact",
  },
  {
    label: "Roadmap",
    pageKey: "roadmap",
    sections: [roadmapHero, roadmap, cta],
    slug: "/roadmap",
  },
  {
    label: "Privacy Policy",
    pageKey: "privacy",
    sections: [],
    slug: "/privacy",
  },
  {
    label: "Terms of Service",
    pageKey: "terms",
    sections: [],
    slug: "/terms",
  },
];

export const riwaqStarterTemplate: TemplatePlanVariant = {
  businessType: "agency",
  defaultAccentColor: "#522C1F",
  defaultBackgroundColor: "",
  defaultChartColor: "#907762",
  defaultColorSystem: "rubbait",
  defaultContent: riwaqDefaultContent,
  defaultFontFamily: "Raleway",
  defaultHeadingFontFamily: "Raleway",
  defaultIconLibrary: "lucide",
  defaultMenuAccent: "subtle",
  defaultMenuStyle: "default-translucent",
  defaultRadius: "none",
  defaultStylePreset: "lyra",
  description:
    "A starter real-estate template focused on trust, publishing, contact capture, and project-history visibility.",
  editableFields: riwaqContentSchema,
  features: ["landing", "blog", "contact", "roadmap", "project-history"],
  footer: riwaqFooterConfig,
  key: "riwaq-starter",
  marketingTagline:
    "A clean starter site for real-estate teams that want their project history to build trust.",
  name: "Riwaq",
  nav: riwaqNavConfig,
  pages,
  placeholderData: riwaqPlaceholderData,
  purchasable: false,
  supportedPlans: ["starter"],
  tags: [
    "register-template",
    "starter",
    "agency",
    "residential",
    "rental",
    "luxury",
    "clean",
    "editorial",
    "brand",
    "leads",
    "listings",
    "balanced",
    "project-history",
  ],
  tier: "starter",
};
