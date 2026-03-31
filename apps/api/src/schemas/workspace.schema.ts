import { z } from "zod";

export const completeOnboardingInputSchema = z.object({
  companyName: z.string().trim().min(1),
  market: z.string().trim().min(1, "Primary market is required."),
  subdomain: z.string().trim().min(1),
  templateKey: z.string().trim().min(1),
});

export const saveOnboardingProgressInputSchema = z.object({
  currentStep: z.string().trim().min(1).optional(),
  // Step 1: Business Identity
  tagline: z.string().trim().nullable().optional(),
  businessType: z.string().trim().nullable().optional(),
  primaryGoal: z.string().trim().nullable().optional(),
  // Step 2: Market Focus
  locations: z.array(z.string().trim()).optional(),
  propertyTypes: z.array(z.string().trim()).optional(),
  targetAudience: z.array(z.string().trim()).optional(),
  // Step 3: Brand Style
  tone: z.string().trim().nullable().optional(),
  stylePreference: z.string().trim().nullable().optional(),
  preferredColorHint: z.string().trim().nullable().optional(),
  // Step 4: Contact And Operations
  phone: z.string().trim().nullable().optional(),
  contactEmail: z.string().trim().nullable().optional(),
  whatsapp: z.string().trim().nullable().optional(),
  officeAddress: z.string().trim().nullable().optional(),
  // Step 5: Content Readiness
  hasLogo: z.boolean().optional(),
  hasListings: z.boolean().optional(),
  hasExistingContent: z.boolean().optional(),
  hasAgents: z.boolean().optional(),
  hasProjects: z.boolean().optional(),
  hasTestimonials: z.boolean().optional(),
  hasBlogContent: z.boolean().optional(),
  // Final step
  market: z.string().trim().optional(),
  templateKey: z.string().trim().optional(),
});

export const createTemplateDraftInputSchema = z.object({
  templateKey: z.string().trim().min(1, "Template key is required."),
});

export const changePlanInputSchema = z.object({
  planStatus: z.enum(["active", "past_due", "canceled"]).default("active"),
  planTier: z.enum(["starter", "plus", "pro"]),
  /** External billing provider reference (Stripe subscription ID, Paystack reference, etc.) */
  providerRef: z.string().trim().optional(),
});

export const initializeCheckoutInputSchema = z.object({
  callbackUrl: z.string().url().optional(),
  interval: z.enum(["monthly", "annual"]),
  planTier: z.enum(["plus", "pro"]),
});

export const createAppointmentInputSchema = z.object({
  agentId: z.string().uuid().optional(),
  email: z.string().email(),
  leadId: z.string().uuid().optional(),
  location: z.string().trim().optional(),
  name: z.string().trim().min(1),
  notes: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  propertyId: z.string().uuid().optional(),
  scheduledAt: z.string().datetime(),
});

export const updateAppointmentStatusInputSchema = z.object({
  appointmentId: z.string().uuid(),
  notes: z.string().trim().optional(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
});

export const updateSiteFieldInputSchema = z.object({
  configId: z.string().trim().min(1, "Configuration id is required."),
  contentKey: z.string().trim().min(1, "Content key is required."),
  value: z.string(),
});

export const publishSiteConfigurationInputSchema = z.object({
  configId: z.string().trim().min(1, "Configuration id is required."),
  nextName: z.string().trim().optional(),
});

export const smartFillFieldInputSchema = z.object({
  configId: z.string().trim().min(1, "Configuration id is required."),
  contentKey: z.string().trim().min(1, "Content key is required."),
  longDetail: z.string().trim().optional(),
  preferredLength: z.string().trim().optional(),
  shortDetail: z.string().trim().min(1, "Field detail is required."),
});

export const generatePageContentInputSchema = z.object({
  pageKey: z.string().trim().min(1, "Page key is required."),
});

export const updateLeadStatusInputSchema = z.object({
  leadId: z.string().trim().min(1, "Lead id is required."),
  notes: z.string().trim().optional(),
  status: z.enum(["new", "contacted", "qualified", "closed"]),
});

export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusInputSchema>;
export type CompleteOnboardingInput = z.infer<
  typeof completeOnboardingInputSchema
>;
export type CreateTemplateDraftInput = z.infer<
  typeof createTemplateDraftInputSchema
>;
export type UpdateSiteFieldInput = z.infer<typeof updateSiteFieldInputSchema>;
export type PublishSiteConfigurationInput = z.infer<
  typeof publishSiteConfigurationInputSchema
>;
export type SmartFillFieldInput = z.infer<typeof smartFillFieldInputSchema>;
export type GeneratePageContentInput = z.infer<
  typeof generatePageContentInputSchema
>;
export type SaveOnboardingProgressInput = z.infer<
  typeof saveOnboardingProgressInputSchema
>;

export const searchDomainInputSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Domain label is required.")
    .max(63, "Domain label is too long."),
  tlds: z.array(z.string().trim()).optional(),
});

export const connectCustomDomainInputSchema = z.object({
  hostname: z
    .string()
    .trim()
    .min(1, "Hostname is required.")
    .max(253, "Hostname is too long."),
});

export const removeCustomDomainInputSchema = z.object({
  domainId: z.string().uuid("Invalid domain id."),
});
