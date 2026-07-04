import {
  Activity,
  BarChart3,
  Calendar,
  CalendarDays,
  MessageCircle,
  MessageSquareMore,
  Radar,
  Target,
  type LucideIcon,
} from "lucide-react";

export type IntegrationConfigField =
  | "calendlyUrl"
  | "facebookPixelId"
  | "googleAnalyticsId"
  | "whatsappPhone";

export type IntegrationCatalogItem = {
  category: string;
  configField: IntegrationConfigField;
  description: string;
  docsUrl: string;
  icon: LucideIcon;
  key: string;
  name: string;
};

export type IntegrationSettingsItem = {
  description: string;
  field: IntegrationConfigField;
  icon: LucideIcon;
  name: string;
  placeholder: string;
};

export const integrations: IntegrationCatalogItem[] = [
  {
    category: "Analytics",
    configField: "googleAnalyticsId",
    description:
      "Track website traffic, visitor behaviour, and conversion events with Google Analytics 4.",
    docsUrl: "https://support.google.com/analytics/answer/9304153",
    icon: BarChart3,
    key: "google-analytics",
    name: "Google Analytics",
  },
  {
    category: "Marketing",
    configField: "facebookPixelId",
    description:
      "Measure ad conversions, build audiences, and retarget visitors who interact with your site.",
    docsUrl: "https://www.facebook.com/business/help/952192354843755",
    icon: Target,
    key: "facebook-pixel",
    name: "Facebook Pixel",
  },
  {
    category: "Communication",
    configField: "whatsappPhone",
    description:
      "Let website visitors message you directly on WhatsApp with a single click.",
    docsUrl: "https://business.whatsapp.com/",
    icon: MessageCircle,
    key: "whatsapp",
    name: "WhatsApp Business",
  },
  {
    category: "Scheduling",
    configField: "calendlyUrl",
    description:
      "Sync appointment scheduling with your Calendly page so visitors can book viewings.",
    docsUrl: "https://calendly.com/",
    icon: Calendar,
    key: "calendly",
    name: "Calendly",
  },
];

export const integrationSettings: IntegrationSettingsItem[] = [
  {
    description: "Track website traffic with your GA4 Measurement ID.",
    field: "googleAnalyticsId",
    icon: Activity,
    name: "Google Analytics",
    placeholder: "G-XXXXXXXXXX",
  },
  {
    description:
      "Measure conversions and audience performance with a Pixel ID.",
    field: "facebookPixelId",
    icon: Radar,
    name: "Facebook Pixel",
    placeholder: "123456789012345",
  },
  {
    description:
      "Give visitors a direct messaging route from your public site.",
    field: "whatsappPhone",
    icon: MessageSquareMore,
    name: "WhatsApp Business",
    placeholder: "+234 800 000 0000",
  },
  {
    description: "Sync appointment scheduling with your public booking flow.",
    field: "calendlyUrl",
    icon: CalendarDays,
    name: "Calendly",
    placeholder: "https://calendly.com/your-name",
  },
];
