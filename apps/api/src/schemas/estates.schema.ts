import { z } from "zod";

export const estatePublishStateSchema = z.enum([
  "draft",
  "published",
  "archived",
]);

export const estateSlugInputSchema = z.object({
  slug: z.string().trim().min(1, "Estate slug is required."),
});

export const estateIdInputSchema = z.object({
  estateId: z.string().uuid("Invalid estate id."),
});

export const plotIdInputSchema = z.object({
  plotId: z.string().uuid("Invalid plot id."),
});

const estateFieldsSchema = z.object({
  amenities: z.string().trim().optional().nullable(),
  approvals: z.string().trim().optional().nullable(),
  brochureUrl: z.string().url().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  heroImageUrl: z.string().url().optional().nullable(),
  landmarks: z.string().trim().optional().nullable(),
  location: z.string().trim().optional().nullable(),
  phaseLabel: z.string().trim().optional().nullable(),
  publishState: estatePublishStateSchema.optional(),
  slug: z.string().trim().min(1).optional(),
  specialPurposeUses: z.string().trim().optional().nullable(),
  title: z.string().trim().min(1, "Title is required."),
});

export const createEstateInputSchema = estateFieldsSchema;

export const updateEstateInputSchema = estateFieldsSchema.partial().extend({
  estateId: z.string().uuid("Invalid estate id."),
});

export const createEstateLayoutInputSchema = estateIdInputSchema.extend({
  sourceUrl: z.string().url("Plan upload URL is required."),
});

const plotFieldsSchema = z.object({
  block: z.string().trim().optional().nullable(),
  coordinatesJson: z
    .custom<Record<string, unknown> | Array<unknown> | null>()
    .optional(),
  facing: z.string().trim().optional().nullable(),
  isCornerPiece: z.boolean().optional(),
  isPremium: z.boolean().optional(),
  metadataJson: z
    .custom<Record<string, unknown> | Array<unknown> | null>()
    .optional(),
  plotCode: z.string().trim().min(1, "Plot code is required."),
  price: z.string().trim().optional().nullable(),
  sizeSqm: z.number().int().nonnegative().optional().nullable(),
  status: z
    .enum(["available", "held", "reserved", "sold", "blocked"])
    .optional(),
  street: z.string().trim().optional().nullable(),
  tagsJson: z
    .custom<Record<string, unknown> | Array<unknown> | null>()
    .optional(),
  type: z
    .enum(["residential", "commercial", "mixed_use", "amenity"])
    .optional()
    .nullable(),
});

export const createPlotInputSchema = plotFieldsSchema.extend({
  estateId: z.string().uuid("Invalid estate id."),
});

export const updatePlotInputSchema = plotFieldsSchema.partial().extend({
  plotId: z.string().uuid("Invalid plot id."),
});
