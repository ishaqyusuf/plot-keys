import { z } from "zod";

export const updateIntegrationInputSchema = z.object({
  calendlyUrl: z.string().trim().optional().nullable(),
  facebookPixelId: z.string().trim().optional().nullable(),
  googleAnalyticsId: z.string().trim().optional().nullable(),
  whatsappPhone: z.string().trim().optional().nullable(),
});
