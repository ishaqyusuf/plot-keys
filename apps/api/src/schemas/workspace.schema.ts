import { z } from "zod";

export const completeOnboardingInputSchema = z.object({
  companyName: z.string().trim().min(1),
  market: z.string().trim().min(1, "Primary market is required."),
  subdomain: z.string().trim().min(1),
  templateKey: z.string().trim().min(1),
});

export const saveOnboardingProgressInputSchema = z.object({
  currentStep: z.string().trim().min(1).optional(),
  market: z.string().trim().optional(),
  templateKey: z.string().trim().optional(),
});

export const createTemplateDraftInputSchema = z.object({
  templateKey: z.string().trim().min(1, "Template key is required."),
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
