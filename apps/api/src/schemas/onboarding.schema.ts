import { z } from "zod";

export const completeOnboardingInputSchema = z.object({
  companyName: z.string().trim().min(1),
  logoUrl: z.string().trim().url().nullable().optional(),
  market: z.string().trim().min(1, "Primary market is required."),
  subdomain: z.string().trim().min(1),
  templateKey: z.string().trim().min(1),
});

export const saveOnboardingProgressInputSchema = z.object({
  businessType: z.string().trim().nullable().optional(),
  contactEmail: z.string().trim().nullable().optional(),
  currentStep: z.string().trim().min(1).optional(),
  hasAgents: z.boolean().optional(),
  hasBlogContent: z.boolean().optional(),
  hasExistingContent: z.boolean().optional(),
  hasListings: z.boolean().optional(),
  hasLogo: z.boolean().optional(),
  hasProjects: z.boolean().optional(),
  hasTestimonials: z.boolean().optional(),
  locations: z.array(z.string().trim()).optional(),
  market: z.string().trim().optional(),
  officeAddress: z.string().trim().nullable().optional(),
  phone: z.string().trim().nullable().optional(),
  preferredColorHint: z.string().trim().nullable().optional(),
  primaryGoal: z.string().trim().nullable().optional(),
  propertyTypes: z.array(z.string().trim()).optional(),
  stylePreference: z.string().trim().nullable().optional(),
  tagline: z.string().trim().nullable().optional(),
  targetAudience: z.array(z.string().trim()).optional(),
  templateKey: z.string().trim().optional(),
  tone: z.string().trim().nullable().optional(),
  whatsapp: z.string().trim().nullable().optional(),
});

export const updateOnboardingInputsSchema = z.object({
  businessType: z.string().optional(),
  primaryGoal: z.string().optional(),
  stylePreference: z.string().optional(),
  tone: z.string().optional(),
});

export type CompleteOnboardingInput = z.infer<
  typeof completeOnboardingInputSchema
>;
export type SaveOnboardingProgressInput = z.infer<
  typeof saveOnboardingProgressInputSchema
>;
