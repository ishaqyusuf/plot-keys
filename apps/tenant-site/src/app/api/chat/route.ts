import { type ChatBotMessage, getChatCompletion } from "@plotkeys/chat-bot";
import { createPrismaClient } from "@plotkeys/db";
import { getTenantChatContext } from "@plotkeys/db/queries";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subdomain, messages } = body as {
      subdomain?: string;
      messages?: Array<{ role: string; content: string }>;
    };

    if (!subdomain?.trim()) {
      return NextResponse.json(
        { error: "subdomain is required." },
        { status: 400 },
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required and must not be empty." },
        { status: 400 },
      );
    }

    // Validate and cap messages
    const validMessages: ChatBotMessage[] = messages
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0,
      )
      .slice(-50)
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content.trim().slice(0, 2000),
      }));

    if (validMessages.length === 0) {
      return NextResponse.json(
        { error: "At least one valid user message is required." },
        { status: 400 },
      );
    }

    const prisma = createPrismaClient().db;
    if (!prisma) {
      return NextResponse.json(
        { error: "Service unavailable." },
        { status: 503 },
      );
    }

    const context = await getTenantChatContext(prisma, { subdomain });

    if (!context) {
      return NextResponse.json(
        { error: "Unknown workspace." },
        { status: 404 },
      );
    }

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
      validMessages,
    );

    if (!result) {
      return NextResponse.json(
        { error: "Chat service is not available." },
        { status: 503 },
      );
    }

    return NextResponse.json({ reply: result.reply });
  } catch {
    return NextResponse.json(
      { error: "Unable to process request." },
      { status: 500 },
    );
  }
}
