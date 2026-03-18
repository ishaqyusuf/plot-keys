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
  targetAudience: z.string().trim().nullable().optional(),
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
export type SaveOnboardingProgressInput = z.infer<
  typeof saveOnboardingProgressInputSchema
>;

// ---------------------------------------------------------------------------
// Property schemas
// ---------------------------------------------------------------------------

export const createPropertyInputSchema = z.object({
  bathrooms: z.number().int().min(0).nullable().optional(),
  bedrooms: z.number().int().min(0).nullable().optional(),
  description: z.string().trim().nullable().optional(),
  featured: z.boolean().optional(),
  imageUrl: z.string().trim().url().nullable().optional(),
  location: z.string().trim().min(1, "Location is required."),
  price: z.string().trim().nullable().optional(),
  specs: z.string().trim().nullable().optional(),
  status: z.enum(["active", "sold", "rented", "off_market"]).optional(),
  title: z.string().trim().min(1, "Title is required."),
});

export const updatePropertyInputSchema = createPropertyInputSchema
  .partial()
  .extend({
    propertyId: z.string().trim().min(1, "Property id is required."),
  });

export const deletePropertyInputSchema = z.object({
  propertyId: z.string().trim().min(1, "Property id is required."),
});

// ---------------------------------------------------------------------------
// Agent schemas
// ---------------------------------------------------------------------------

export const createAgentInputSchema = z.object({
  bio: z.string().trim().nullable().optional(),
  displayOrder: z.number().int().min(0).optional(),
  email: z.string().trim().email().nullable().optional(),
  featured: z.boolean().optional(),
  imageUrl: z.string().trim().url().nullable().optional(),
  name: z.string().trim().min(1, "Name is required."),
  phone: z.string().trim().nullable().optional(),
  title: z.string().trim().nullable().optional(),
});

export const updateAgentInputSchema = createAgentInputSchema.partial().extend({
  agentId: z.string().trim().min(1, "Agent id is required."),
});

export const deleteAgentInputSchema = z.object({
  agentId: z.string().trim().min(1, "Agent id is required."),
});
