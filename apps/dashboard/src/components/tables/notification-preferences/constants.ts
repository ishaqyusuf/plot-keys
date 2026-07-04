export const notificationTypes = [
  {
    description: "When a visitor submits a contact form on your website.",
    label: "New lead captured",
    type: "new_lead_captured",
  },
  {
    description: "When your website is published or updated.",
    label: "Site published",
    type: "site_published",
  },
  {
    description: "When your account is first created.",
    label: "Sign-up confirmation",
    type: "signup_successful",
  },
  {
    description: "Reminders to complete your workspace setup.",
    label: "Onboarding reminder",
    type: "onboarding_reminder",
  },
  {
    description: "When changes are saved to your site builder.",
    label: "Site configuration saved",
    type: "site_configuration_saved",
  },
  {
    description: "When a visitor subscribes to your newsletter.",
    label: "Newsletter subscriber",
    type: "subscriber_lead_created",
  },
] as const;
