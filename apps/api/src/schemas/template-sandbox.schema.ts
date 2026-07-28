import { z } from "zod";

export const templateSandboxPlanTierSchema = z.enum(["starter", "plus", "pro"]);

export const templateSandboxJsonSchema = z
  .record(z.string(), z.unknown())
  .default({});

export const templateSandboxProfileIdInputSchema = z.object({
  profileId: z.string().uuid("Invalid sandbox profile id."),
});

export const templateSandboxPreviewInputSchema = z.object({
  mode: z.enum(["draft", "live"]).default("draft"),
  pathname: z
    .string()
    .trim()
    .default("/")
    .transform((value) => value || "/"),
  shareId: z.string().trim().min(1, "Sandbox share id is required."),
});

export const createTemplateSandboxProfileInputSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required."),
  market: z.string().trim().optional().nullable(),
  name: z.string().trim().optional(),
  planTier: templateSandboxPlanTierSchema.default("starter"),
  profileJson: templateSandboxJsonSchema.optional(),
  sampleDataJson: templateSandboxJsonSchema.optional(),
  subdomainLabel: z.string().trim().optional().nullable(),
  templateKey: z.string().trim().min(1, "Template key is required."),
});

export const updateTemplateSandboxProfileInputSchema =
  templateSandboxProfileIdInputSchema.extend({
    companyName: z.string().trim().min(1).optional(),
    contentJson: templateSandboxJsonSchema.optional(),
    market: z.string().trim().optional().nullable(),
    name: z.string().trim().min(1).optional(),
    planTier: templateSandboxPlanTierSchema.optional(),
    profileJson: templateSandboxJsonSchema.optional(),
    sampleDataJson: templateSandboxJsonSchema.optional(),
    subdomainLabel: z.string().trim().optional().nullable(),
    templateKey: z.string().trim().min(1).optional(),
    themeJson: templateSandboxJsonSchema.optional(),
  });

export const updateTemplateSandboxContentFieldInputSchema =
  templateSandboxProfileIdInputSchema.extend({
    contentKey: z.string().trim().min(1, "Content key is required."),
    value: z.string(),
  });

export const updateTemplateSandboxThemeFieldInputSchema =
  templateSandboxProfileIdInputSchema.extend({
    themeKey: z.string().trim().min(1, "Theme key is required."),
    value: z.string(),
  });

export type CreateTemplateSandboxProfileInput = z.infer<
  typeof createTemplateSandboxProfileInputSchema
>;
export type UpdateTemplateSandboxProfileInput = z.infer<
  typeof updateTemplateSandboxProfileInputSchema
>;
export type TemplateSandboxPreviewInput = z.infer<
  typeof templateSandboxPreviewInputSchema
>;
