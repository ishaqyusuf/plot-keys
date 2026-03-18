import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic();
  }
  return _client;
}

export type SmartFillContext = {
  businessSummary?: string | null;
  companyName?: string | null;
  contentKey: string;
  longDetail?: string | null;
  market?: string | null;
  preferredLength?: string | null;
  shortDetail: string;
  templateKey?: string | null;
};

/**
 * Generates a single field value using Claude Haiku 4.5 (fast, low-cost).
 * Returns the generated text or null if the API key is not configured.
 */
export async function generateFieldContent(
  ctx: SmartFillContext,
): Promise<string | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }

  const client = getAnthropicClient();

  const companyLine = ctx.companyName ? `Company: ${ctx.companyName}` : null;
  const marketLine = ctx.market ? `Market: ${ctx.market}` : null;
  const summaryLine = ctx.businessSummary
    ? `Business profile: ${ctx.businessSummary}`
    : null;
  const lengthLine = ctx.preferredLength
    ? `Preferred length: ${ctx.preferredLength}`
    : null;

  const contextLines = [companyLine, marketLine, summaryLine, lengthLine]
    .filter(Boolean)
    .join("\n");

  const instruction = ctx.longDetail ?? ctx.shortDetail;

  const userMessage = [
    contextLines,
    "",
    `Field: ${ctx.shortDetail}`,
    `Instruction: ${instruction}`,
    "",
    "Return only the requested copy. No quotes, no commentary, no formatting.",
  ]
    .filter((line) => line !== undefined)
    .join("\n")
    .trim();

  const response = await client.messages.create({
    max_tokens: 256,
    messages: [{ role: "user", content: userMessage }],
    model: "claude-haiku-4-5",
    system:
      "You are a real-estate website copywriter. Generate concise, high-quality copy for specific website sections. " +
      "Write in a confident, professional tone. Return only the text for the field — no quotes, no labels, no markdown.",
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") return null;

  return textBlock.text.trim();
}
