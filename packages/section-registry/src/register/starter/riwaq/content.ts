import type { ContentFieldDef } from "../../types";

function field(
  contentKey: string,
  label: string,
  defaultValue: string,
  placeholderValue = defaultValue,
  aiEnabled = true,
): ContentFieldDef {
  return {
    aiEnabled,
    contentKey,
    defaultValue,
    label,
    placeholderValue,
  };
}

export const riwaqContentSchema: ContentFieldDef[] = [
  field("hero.eyebrow", "Hero eyebrow", "Discover your ideal property"),
  field(
    "hero.title",
    "Hero title",
    "Find spaces that feel ready for your next chapter.",
  ),
  field(
    "hero.subtitle",
    "Hero subtitle",
    "Search calm homes, compare trusted projects, and see the delivery history behind each opportunity before you enquire.",
  ),
  field("hero.ctaText", "Hero CTA", "Start your search"),
  field("hero.secondaryCtaText", "Hero secondary CTA", "View project history"),
  field("hero.searchEyebrow", "Hero search eyebrow", "Discover"),
  field(
    "hero.searchTitle",
    "Hero search title",
    "Your ideal property, filtered for the way you want to live.",
  ),
  field("hero.searchMode1", "Hero search mode 1", "Rent"),
  field("hero.searchMode2", "Hero search mode 2", "Buy"),
  field("hero.searchMode3", "Hero search mode 3", "Short let"),
  field("hero.searchLocationLabel", "Hero search location label", "Location"),
  field("hero.searchLocationValue", "Hero search location value", "Lagos"),
  field("hero.searchTypeLabel", "Hero search type label", "Property type"),
  field("hero.searchTypeValue", "Hero search type value", "Apartment"),
  field("hero.searchBudgetLabel", "Hero search budget label", "Budget"),
  field("hero.searchBudgetValue", "Hero search budget value", "Flexible"),
  field("hero.searchButton", "Hero search button", "Start search"),
  field("hero.badgeEyebrow", "Hero badge eyebrow", "Curated match"),
  field("hero.badgeTitle", "Hero badge title", "Prime homes in Lagos"),
  field("hero.badgeMeta", "Hero badge meta", "Updated weekly"),
  field(
    "media.heroImage",
    "Hero image URL",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    false,
  ),
  field(
    "media.detailImage",
    "Detail image URL",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    false,
  ),
  field("blog.eyebrow", "Blog eyebrow", "Blog"),
  field(
    "blog.title",
    "Blog title",
    "Notes from the market and project floor.",
  ),
  field(
    "blog.subtitle",
    "Blog subtitle",
    "Publish project updates, customer guidance, and market commentary in one focused editorial stream.",
  ),
  field("marketStats.stat1Label", "Stat 1 label", "Projects documented"),
  field("marketStats.stat1Value", "Stat 1 value", "18"),
  field("marketStats.stat2Label", "Stat 2 label", "Active communities"),
  field("marketStats.stat2Value", "Stat 2 value", "6"),
  field("marketStats.stat3Label", "Stat 3 label", "Years operating"),
  field("marketStats.stat3Value", "Stat 3 value", "9"),
  field("story.eyebrow", "Story eyebrow", "Why Riwaq works"),
  field("story.cardEyebrow", "Story card eyebrow", "Featured delivery"),
  field("story.heading", "Story heading", "A calm record of progress."),
  field(
    "story.body",
    "Story body",
    "Show visitors what has been launched, improved, handed over, and planned across time.",
  ),
  field("story.ctaLabel", "Story CTA", "Read the roadmap"),
  field("roadmap.eyebrow", "Roadmap eyebrow", "Project history"),
  field("roadmap.title", "Roadmap title", "A visible record of delivery."),
  field(
    "roadmap.subtitle",
    "Roadmap subtitle",
    "Use the roadmap to show what the company has launched, improved, handed over, or planned across time.",
  ),
  field("roadmap.item1.year", "Roadmap item 1 year", "2016"),
  field("roadmap.item1.title", "Roadmap item 1 title", "First managed portfolio"),
  field(
    "roadmap.item1.body",
    "Roadmap item 1 body",
    "Started with a small portfolio and a commitment to transparent buyer and renter communication.",
  ),
  field("roadmap.item2.year", "Roadmap item 2 year", "2019"),
  field("roadmap.item2.title", "Roadmap item 2 title", "Neighborhood expansion"),
  field(
    "roadmap.item2.body",
    "Roadmap item 2 body",
    "Expanded into new communities and documented each milestone for customers and partners.",
  ),
  field("roadmap.item3.year", "Roadmap item 3 year", "2024"),
  field("roadmap.item3.title", "Roadmap item 3 title", "Digital trust layer"),
  field(
    "roadmap.item3.body",
    "Roadmap item 3 body",
    "Moved project history, updates, and enquiry paths into one public tenant website.",
  ),
  field("contact.email", "Contact email", "hello@example-realestate.com"),
  field("contact.phone", "Contact phone", "+234 800 000 0000"),
  field("contact.address", "Contact address", "Victoria Island, Lagos"),
  field("contact.whatsapp", "Contact WhatsApp", "+234 800 000 0000"),
  field("contact.eyebrow", "Contact eyebrow", "Contact"),
  field(
    "contact.title",
    "Contact title",
    "Start a conversation with the team.",
  ),
  field(
    "contact.subtitle",
    "Contact subtitle",
    "Ask about a current opportunity, a past project, or the next step in your property search.",
  ),
  field("contact.form.emailLabel", "Contact email label", "Email"),
  field(
    "contact.form.emailPlaceholder",
    "Contact email placeholder",
    "you@example.com",
    "you@example.com",
    false,
  ),
  field("contact.form.messageLabel", "Contact message label", "Message"),
  field(
    "contact.form.messagePlaceholder",
    "Contact message placeholder",
    "Tell us what you need.",
    "Tell us what you need.",
    false,
  ),
  field("contact.form.submitLabel", "Contact submit label", "Send enquiry"),
  field("cta.heading", "CTA heading", "Ready to discuss the next project?"),
  field(
    "cta.subheading",
    "CTA subheading",
    "Share your goals and let the team respond with the right property, project, or partnership path.",
  ),
  field("cta.ctaLabel", "CTA label", "Contact us"),
];

export const riwaqDefaultContent = Object.fromEntries(
  riwaqContentSchema.map((item) => [item.contentKey, item.defaultValue]),
);

export const riwaqPlaceholderContent = Object.fromEntries(
  riwaqContentSchema.map((item) => [item.contentKey, item.placeholderValue]),
);
