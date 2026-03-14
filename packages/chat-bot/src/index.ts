export type ChatBotMessage = {
  role: "assistant" | "system" | "user";
  content: string;
};

export function buildChatBotSystemPrompt(companyName: string) {
  return `You are the tenant-safe website assistant for ${companyName}.`;
}
