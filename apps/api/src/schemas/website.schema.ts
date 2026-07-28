import { z } from "zod";

export const createTemplateDraftInputSchema = z.object({
  templateKey: z.string().trim().min(1, "Template key is required."),
});

export const updateSiteFieldInputSchema = z.object({
  configId: z.string().trim().min(1, "Configuration id is required."),
  contentKey: z.string().trim().min(1, "Content key is required."),
  value: z.string(),
});

export const updateSiteThemeFieldInputSchema = z.object({
  configId: z.string().trim().min(1, "Configuration id is required."),
  themeKey: z.string().trim().min(1, "Theme key is required."),
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

export const getLivePreviewInputSchema = z.object({
  hostname: z.string().trim().min(1).nullable().optional(),
  subdomain: z.string().trim().min(1).nullable().optional(),
});

export const getSiteRenderDataInputSchema = z.object({
  subdomain: z.string().trim().min(1, "Subdomain is required."),
});

export type CreateTemplateDraftInput = z.infer<
  typeof createTemplateDraftInputSchema
>;
export type UpdateSiteFieldInput = z.infer<typeof updateSiteFieldInputSchema>;
export type UpdateSiteThemeFieldInput = z.infer<
  typeof updateSiteThemeFieldInputSchema
>;
export type PublishSiteConfigurationInput = z.infer<
  typeof publishSiteConfigurationInputSchema
>;
export type SmartFillFieldInput = z.infer<typeof smartFillFieldInputSchema>;
export type GeneratePageContentInput = z.infer<
  typeof generatePageContentInputSchema
>;
