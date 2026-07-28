import { z } from "zod";

export const purchaseStockImageInputSchema = z.object({
  imageId: z.string().trim().min(1, "Image id is required."),
});
