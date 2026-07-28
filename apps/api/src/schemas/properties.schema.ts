import { z } from "zod";

const propertyTypeSchema = z.enum([
  "residential",
  "commercial",
  "land",
  "industrial",
  "mixed_use",
]);

const propertyStatusSchema = z.enum(["active", "sold", "rented", "off_market"]);

export const listPropertiesInputSchema = z
  .object({
    cursor: z.union([z.string(), z.number()]).optional().nullable(),
    q: z.string().optional().nullable(),
    size: z.union([z.string(), z.number()]).optional().nullable(),
    sort: z.array(z.string()).optional().nullable(),
    type: z.string().optional().nullable(),
  })
  .optional();

export const propertyIdInputSchema = z.object({
  propertyId: z.string().trim().min(1, "Property id is required."),
});

export const propertyIdsInputSchema = z.object({
  propertyIds: z.array(z.string().trim().min(1)).min(1),
});

const propertyFieldsSchema = z.object({
  bathrooms: z.number().int().nonnegative().optional().nullable(),
  bedrooms: z.number().int().nonnegative().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  estateId: z.string().uuid().optional().nullable(),
  featured: z.boolean().optional(),
  imageUrl: z.string().url().optional().nullable(),
  location: z.string().trim().optional().nullable(),
  paymentPlanAmount: z.string().trim().optional().nullable(),
  paymentPlanInitialDepositPercent: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .nullable(),
  paymentPlanMonthlyAmount: z.string().trim().optional().nullable(),
  paymentPlanMonths: z.number().int().positive().optional().nullable(),
  paymentPlansJson: z.array(z.unknown()).optional().nullable(),
  price: z.string().trim().optional().nullable(),
  quantityAvailable: z.number().int().nonnegative().optional().nullable(),
  specs: z.string().trim().optional().nullable(),
  status: propertyStatusSchema.optional(),
  subType: z.string().trim().optional().nullable(),
  title: z.string().trim().min(1, "Title is required."),
  type: propertyTypeSchema.optional().nullable(),
});

export const createPropertyInputSchema = propertyFieldsSchema.extend({
  featured: z.boolean().optional().default(false),
  status: propertyStatusSchema.optional().default("active"),
});

export const updatePropertyInputSchema = propertyFieldsSchema.partial().extend({
  propertyId: z.string().trim().min(1, "Property id is required."),
});
