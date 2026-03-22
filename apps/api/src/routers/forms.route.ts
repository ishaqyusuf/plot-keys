/**
 * Public form action registry.
 *
 * Handles site-visitor submissions: contact enquiries, property inquiries,
 * newsletter sign-ups, and similar public-facing form actions.
 * No authentication required — these are submitted from public tenant sites.
 */

import { createPrismaClient } from "@plotkeys/db";
import {
  notificationDispatchHandler,
  triggerJob,
} from "@plotkeys/jobs";
import { notificationDispatchTask } from "@plotkeys/jobs/tasks";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../lib.trpc";

let _client: ReturnType<typeof createPrismaClient> | null = null;
function getDb() {
  if (!_client) _client = createPrismaClient();
  const { db } = _client;
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DATABASE_URL is not configured." });
  return db;
}

const contactInputSchema = z.object({
  email: z.string().email("A valid email address is required."),
  message: z.string().trim().min(1, "Message cannot be empty.").max(2000),
  name: z.string().trim().min(1, "Name is required.").max(120),
  phone: z.string().trim().optional(),
  /** The public subdomain of the tenant site receiving the submission. */
  subdomain: z.string().trim().min(1, "Subdomain is required."),
  subject: z.string().trim().optional(),
});

const inquiryInputSchema = z.object({
  email: z.string().email("A valid email address is required."),
  message: z.string().trim().max(2000).optional(),
  name: z.string().trim().min(1, "Name is required.").max(120),
  phone: z.string().trim().optional(),
  /** The listing or property identifier this inquiry is about. */
  propertyRef: z.string().trim().optional(),
  subdomain: z.string().trim().min(1, "Subdomain is required."),
});

const newsletterInputSchema = z.object({
  email: z.string().email("A valid email address is required."),
  name: z.string().trim().optional(),
  subdomain: z.string().trim().min(1, "Subdomain is required."),
});

async function resolveCompanyBySubdomain(subdomain: string) {
  const db = getDb();
  const company = await db.company.findFirst({
    select: { id: true, name: true },
    where: { deletedAt: null, slug: subdomain },
  });

  if (!company) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `No workspace found for subdomain "${subdomain}".`,
    });
  }

  return company;
}

export const formsRouter = createTRPCRouter({
  /**
   * General contact form submission from a public tenant site.
   * Dispatches a notification job to email the company owner.
   */
  submitContact: publicProcedure
    .input(contactInputSchema)
    .mutation(async ({ input }) => {
      const company = await resolveCompanyBySubdomain(input.subdomain);

      triggerJob(
        notificationDispatchTask,
        notificationDispatchHandler,
        {
          kind: "contact_form" as const,
          data: {
            companyId: company.id,
            email: input.email,
            message: input.message,
            name: input.name,
            phone: input.phone,
          },
        },
      ).catch(() => {
        // Notification delivery failures are non-blocking
      });

      return {
        received: true,
        type: "contact" as const,
      };
    }),

  /**
   * Property inquiry form — tied to a specific listing or a general request.
   * Dispatches a notification job to email the company owner and receipt to inquirer.
   */
  submitInquiry: publicProcedure
    .input(inquiryInputSchema)
    .mutation(async ({ input }) => {
      const company = await resolveCompanyBySubdomain(input.subdomain);

      triggerJob(
        notificationDispatchTask,
        notificationDispatchHandler,
        {
          kind: "property_inquiry" as const,
          data: {
            companyId: company.id,
            email: input.email,
            message: input.message,
            name: input.name,
            phone: input.phone,
            propertyId: input.propertyRef,
          },
        },
      ).catch(() => {
        // Notification delivery failures are non-blocking
      });

      return {
        received: true,
        type: "inquiry" as const,
      };
    }),

  /**
   * Newsletter / mailing-list sign-up from a public tenant site.
   * Dispatches a notification job to send a welcome email.
   */
  submitNewsletterSignup: publicProcedure
    .input(newsletterInputSchema)
    .mutation(async ({ input }) => {
      const company = await resolveCompanyBySubdomain(input.subdomain);

      triggerJob(
        notificationDispatchTask,
        notificationDispatchHandler,
        {
          kind: "newsletter_signup" as const,
          data: {
            companyId: company.id,
            email: input.email,
            name: input.name,
          },
        },
      ).catch(() => {
        // Notification delivery failures are non-blocking
      });

      return {
        received: true,
        type: "newsletter" as const,
      };
    }),
});
