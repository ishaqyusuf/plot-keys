import Anthropic from "@anthropic-ai/sdk";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ChatBotMessage = {
  role: "assistant" | "system" | "user";
  content: string;
};

export type ChatBotContext = {
  companyName: string;
  market?: string | null;
  properties?: Array<{
    title: string;
    location?: string | null;
    price?: number | null;
    specs?: string | null;
  }>;
  agents?: Array<{
    name: string;
    title?: string | null;
    bio?: string | null;
  }>;
  businessSummary?: string | null;
};

export type ChatBotResponse = {
  reply: string;
};

// ---------------------------------------------------------------------------
// Anthropic client singleton
// ---------------------------------------------------------------------------

let _client: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic();
  }
  return _client;
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

export function buildChatBotSystemPrompt(ctx: ChatBotContext): string {
  const lines: string[] = [
    `You are a helpful website assistant for ${ctx.companyName}.`,
    `You assist visitors by answering questions about the company, its services, listed properties, and agents.`,
    `Be friendly, concise, and professional. Keep replies under 200 words unless more detail is requested.`,
    `If you don't know the answer, suggest the visitor contact the company directly.`,
    `Do not reveal that you are an AI unless specifically asked.`,
  ];

  if (ctx.market) {
    lines.push(`The company operates in the ${ctx.market} market.`);
  }

  if (ctx.businessSummary) {
    lines.push(`Business overview: ${ctx.businessSummary}`);
  }

  if (ctx.properties && ctx.properties.length > 0) {
    lines.push("", "Available properties:");
    for (const p of ctx.properties.slice(0, 10)) {
      const parts = [p.title];
      if (p.location) parts.push(`in ${p.location}`);
      if (p.price) parts.push(`priced at ${p.price.toLocaleString()}`);
      if (p.specs) parts.push(`(${p.specs})`);
      lines.push(`- ${parts.join(" ")}`);
    }
  }

  if (ctx.agents && ctx.agents.length > 0) {
    lines.push("", "Team members:");
    for (const a of ctx.agents.slice(0, 10)) {
      const parts = [a.name];
      if (a.title) parts.push(`— ${a.title}`);
      lines.push(`- ${parts.join(" ")}`);
    }
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Chat completion
// ---------------------------------------------------------------------------

/**
 * Sends a conversation to Claude and returns the assistant reply.
 * Returns `null` if the Anthropic API key is not configured.
 */
export async function getChatCompletion(
  context: ChatBotContext,
  messages: ChatBotMessage[],
): Promise<ChatBotResponse | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }

  const client = getAnthropicClient();

  const systemPrompt = buildChatBotSystemPrompt(context);

  // Filter to only user/assistant messages for the API
  const conversationMessages = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  if (conversationMessages.length === 0) {
    return { reply: "Hello! How can I help you today?" };
  }

  const response = await client.messages.create({
    max_tokens: 512,
    messages: conversationMessages,
    model: "claude-haiku-4-5",
    system: systemPrompt,
  });

  const textBlock = response.content.find((b) => b.type === "text");

  return {
    reply: textBlock && textBlock.type === "text" ? textBlock.text.trim() : "I'm sorry, I couldn't generate a response. Please try again.",
  };
}
