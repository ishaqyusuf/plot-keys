/**
 * Chat-bot router — handles tenant-site visitor chat via LLM.
 *
 * Public procedures (no authentication required) since visitors on
 * public tenant sites submit messages without logging in.
 * The tenant is identified by subdomain.
 */

import { type ChatBotMessage, getChatCompletion } from "@plotkeys/chat-bot";
import { createPrismaClient } from "@plotkeys/db";
import { getTenantChatContext } from "@plotkeys/db/queries";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../lib.trpc";

let _client: ReturnType<typeof createPrismaClient> | null = null;
function getDb() {
  if (!_client) _client = createPrismaClient();
  const { db } = _client;
  if (!db)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "DATABASE_URL is not configured.",
    });
  return db;
}

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

const sendMessageSchema = z.object({
  /** The public subdomain of the tenant site. */
  subdomain: z.string().trim().min(1, "Subdomain is required."),
  /** Conversation history (latest user message must be last). */
  messages: z.array(chatMessageSchema).min(1).max(50),
});

export const chatRouter = createTRPCRouter({
  /**
   * Send a message to the tenant-site chat assistant.
   * Resolves the company from the subdomain, builds context from
   * properties/agents, and returns the AI response.
   */
  sendMessage: publicProcedure
    .input(sendMessageSchema)
    .mutation(async ({ input }) => {
      const db = getDb();

      const context = await getTenantChatContext(db, {
        subdomain: input.subdomain,
      });

      if (!context) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No workspace found for subdomain "${input.subdomain}".`,
        });
      }

      const conversationMessages: ChatBotMessage[] = input.messages.map(
        (m) => ({
          role: m.role,
          content: m.content,
        }),
      );

      const result = await getChatCompletion(
        {
          companyName: context.company.name,
          market: context.company.market,
          businessSummary: context.businessSummary,
          properties: context.properties.map((p) => ({
            title: p.title,
            location: p.location,
            price: p.price ? Number(p.price.replace(/[^\d.-]/g, "")) : null,
            specs: p.specs,
          })),
          agents: context.agents.map((a) => ({
            name: a.name,
            title: a.title,
            bio: a.bio,
          })),
        },
        conversationMessages,
      );

      if (!result) {
        throw new TRPCError({
          code: "SERVICE_UNAVAILABLE",
          message: "Chat service is not configured. Please try again later.",
        });
      }

      return { reply: result.reply };
    }),
});
