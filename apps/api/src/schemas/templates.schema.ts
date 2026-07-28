import { z } from "zod";

export const claimTemplateLicenseInputSchema = z.object({
  templateKey: z.string().trim().min(1, "Template key is required."),
});
