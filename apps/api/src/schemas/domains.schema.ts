import { z } from "zod";

export const searchDomainsInputSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Domain label is required.")
    .max(63, "Domain label is too long."),
  tlds: z.array(z.string().trim()).optional(),
});

export const connectDomainInputSchema = z.object({
  hostname: z
    .string()
    .trim()
    .min(1, "Hostname is required.")
    .max(253, "Hostname is too long."),
});

export const removeDomainInputSchema = z.object({
  domainId: z.string().uuid("Invalid domain id."),
});
