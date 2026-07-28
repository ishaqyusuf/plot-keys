import { z } from "zod";

export const initializeCheckoutInputSchema = z.object({
  callbackUrl: z.string().url().optional(),
  interval: z.enum(["monthly", "annual"]),
  planTier: z.enum(["plus", "pro"]),
});
