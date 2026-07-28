export const notificationTypes = [
  {
    category: "website",
    description: "When a visitor submits a contact form on your website.",
    label: "New lead captured",
    order: 1,
    type: "new_lead_captured",
  },
  {
    category: "website",
    description: "When your website is published or updated.",
    label: "Site published",
    order: 2,
    type: "site_published",
  },
  {
    category: "account",
    description: "When your account is first created.",
    label: "Sign-up confirmation",
    order: 1,
    type: "signup_successful",
  },
  {
    category: "workspace",
    description: "Reminders to complete your workspace setup.",
    label: "Onboarding reminder",
    order: 1,
    type: "onboarding_reminder",
  },
  {
    category: "website",
    description: "When changes are saved to your site builder.",
    label: "Site configuration saved",
    order: 3,
    type: "site_configuration_saved",
  },
  {
    category: "website",
    description: "When a visitor subscribes to your newsletter.",
    label: "Newsletter subscriber",
    order: 4,
    type: "subscriber_lead_created",
  },
] as const;

export const notificationCategoryLabels = {
  account: "Account",
  website: "Website",
  workspace: "Workspace",
} as const;
