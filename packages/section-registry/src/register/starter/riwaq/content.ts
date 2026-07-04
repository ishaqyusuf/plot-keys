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
  field("hero.eyebrow", "Hero eyebrow", "Built from proven delivery"),
  field(
    "hero.title",
    "Hero title",
    "Launch a credible property presence with project history in view.",
  ),
  field(
    "hero.subtitle",
    "Hero subtitle",
    "Riwaq gives real-estate teams a focused starter site for trust, publishing, contact capture, and visible delivery momentum.",
  ),
  field("hero.ctaText", "Hero CTA", "View roadmap"),
  field("marketStats.stat1Label", "Stat 1 label", "Projects documented"),
  field("marketStats.stat1Value", "Stat 1 value", "18"),
  field("marketStats.stat2Label", "Stat 2 label", "Active communities"),
  field("marketStats.stat2Value", "Stat 2 value", "6"),
  field("marketStats.stat3Label", "Stat 3 label", "Years operating"),
  field("marketStats.stat3Value", "Stat 3 value", "9"),
  field("story.eyebrow", "Story eyebrow", "Why Riwaq works"),
  field("story.heading", "Story heading", "A calm site for teams with a record to show."),
  field(
    "story.body",
    "Story body",
    "Lead with proof, keep navigation simple, and give visitors a clear path from company history to current opportunities and direct contact.",
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
