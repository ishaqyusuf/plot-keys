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

// ---------------------------------------------------------------------------
// Onboarding AI — Bootstrap hero/intro/CTA copy from onboarding context
// ---------------------------------------------------------------------------

export type OnboardingContentContext = {
  businessSummary?: string | null;
  businessType?: string | null;
  companyName: string;
  designIntent?: string | null;
  locations?: string[];
  market?: string | null;
  primaryGoal?: string | null;
  segment?: string | null;
  tagline?: string | null;
  tone?: string | null;
};

/**
 * Generates hero title, hero subtitle, CTA text, and story section copy
 * from onboarding context using Claude Haiku 4.5.
 * Returns null if the API key is not configured.
 */
export async function generateOnboardingContent(
  ctx: OnboardingContentContext,
): Promise<Record<string, string> | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }

  const client = getAnthropicClient();

  const market =
    ctx.market ??
    (ctx.locations ?? []).filter(Boolean).join(", ") ??
    "your area";

  const contextBlock = [
    `Company: ${ctx.companyName}`,
    ctx.tagline ? `Tagline: ${ctx.tagline}` : null,
    ctx.businessType ? `Business type: ${ctx.businessType}` : null,
    ctx.segment ? `Segment: ${ctx.segment}` : null,
    ctx.designIntent ? `Design intent: ${ctx.designIntent}` : null,
    ctx.primaryGoal ? `Primary goal: ${ctx.primaryGoal}` : null,
    ctx.tone ? `Tone: ${ctx.tone}` : null,
    `Market: ${market}`,
    ctx.businessSummary
      ? `Business profile: ${ctx.businessSummary}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const userMessage = [
    contextBlock,
    "",
    "Generate website copy for this real-estate business. Return ONLY a JSON object with these exact keys:",
    "",
    '  "hero.eyebrow": A short premium label (5-10 words) that appears above the hero title.',
    '  "hero.title": A compelling hero headline (6-12 words) that speaks to the target audience.',
    '  "hero.subtitle": A supporting paragraph (1-2 sentences) expanding on the hero title.',
    '  "cta.headline": A call-to-action section title (4-8 words).',
    '  "cta.description": A brief CTA description (1-2 sentences) encouraging action.',
    '  "cta.buttonLabel": A CTA button label (2-4 words).',
    '  "story.title": A brand story section heading (5-10 words).',
    '  "story.description": A brand story paragraph (2-3 sentences) about the company.',
    "",
    "Guidelines:",
    "- Write in a confident, professional tone appropriate for the business segment.",
    "- Reference the company name and market where natural.",
    "- Match the specified design intent and tone.",
    "- Do NOT use generic filler or placeholder text.",
    "",
    "Return ONLY valid JSON — no markdown, no explanation, no wrapping.",
  ].join("\n");

  const response = await client.messages.create({
    max_tokens: 512,
    messages: [{ role: "user", content: userMessage }],
    model: "claude-haiku-4-5",
    system:
      "You are a real-estate website copywriter specializing in brand-first websites. " +
      "Generate polished, segment-appropriate copy. Return only a JSON object with the requested keys.",
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") return null;

  try {
    const parsed = JSON.parse(textBlock.text.trim());
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
      return null;
    return parsed as Record<string, string>;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Page Content AI — generate all editable fields for a specific page
// ---------------------------------------------------------------------------

export type PageContentContext = {
  businessSummary?: string | null;
  businessType?: string | null;
  companyName: string;
  fields: Array<{
    contentKey: string;
    longDetail: string;
    preferredLength?: string;
    shortDetail: string;
  }>;
  market?: string | null;
  pageKey: string;
  templateKey?: string | null;
  tone?: string | null;
};

/**
 * Generates content for all editable fields on a specific page in a single
 * LLM call. Returns a map of contentKey → generated text, or null if the
 * API key is not configured.
 */
export async function generatePageContent(
  ctx: PageContentContext,
): Promise<Record<string, string> | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }

  if (ctx.fields.length === 0) return {};

  const client = getAnthropicClient();

  const contextBlock = [
    `Company: ${ctx.companyName}`,
    ctx.businessType ? `Business type: ${ctx.businessType}` : null,
    ctx.market ? `Market: ${ctx.market}` : null,
    ctx.tone ? `Tone: ${ctx.tone}` : null,
    ctx.businessSummary ? `Business profile: ${ctx.businessSummary}` : null,
    `Page: ${ctx.pageKey}`,
    ctx.templateKey ? `Template: ${ctx.templateKey}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const fieldDescriptions = ctx.fields
    .map((f, i) => {
      const lines = [
        `  ${i + 1}. Key: "${f.contentKey}"`,
        `     Label: ${f.shortDetail}`,
        `     Instruction: ${f.longDetail}`,
      ];
      if (f.preferredLength) {
        lines.push(`     Preferred length: ${f.preferredLength}`);
      }
      return lines.join("\n");
    })
    .join("\n\n");

  const userMessage = [
    contextBlock,
    "",
    `Generate website copy for the "${ctx.pageKey}" page of this real-estate business.`,
    `Return ONLY a JSON object where each key is the field "Key" and the value is the generated copy.`,
    "",
    "Fields to generate:",
    "",
    fieldDescriptions,
    "",
    "Guidelines:",
    "- Write in a confident, professional tone appropriate for the business segment.",
    "- Reference the company name and market where natural.",
    "- Match the specified tone if provided.",
    "- Respect the preferred length for each field.",
    "- Do NOT use generic filler or placeholder text.",
    "- Make the content specific to the page context.",
    "",
    "Return ONLY valid JSON — no markdown, no explanation, no wrapping.",
  ].join("\n");

  const response = await client.messages.create({
    max_tokens: 2048,
    messages: [{ role: "user", content: userMessage }],
    model: "claude-haiku-4-5",
    system:
      "You are a real-estate website copywriter specializing in brand-first websites. " +
      "Generate polished, segment-appropriate copy for all requested fields. Return only a JSON object with the requested keys.",
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") return null;

  try {
    const parsed = JSON.parse(textBlock.text.trim());
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
      return null;
    return parsed as Record<string, string>;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Project AI — Summary, Risk Flags, Customer Draft
// ---------------------------------------------------------------------------

export type ProjectAiContext = {
  companyName: string;
  projectName: string;
  projectStatus: string;
  projectType?: string | null;
  location?: string | null;
  startDate?: string | null;
  targetCompletionDate?: string | null;
  phases: Array<{ name: string; status: string }>;
  milestones: Array<{
    name: string;
    status: string;
    dueDate?: string | null;
    completedAt?: string | null;
  }>;
  recentUpdates: Array<{
    kind: string;
    summary: string;
    details?: string | null;
    progressPercent?: number | null;
    postedAt: string;
  }>;
  openIssues: Array<{
    title: string;
    severity: string;
    status: string;
  }>;
  budget?: {
    approvedMinor: number;
    forecastMinor: number;
    actualMinor: number;
    currency: string;
  } | null;
};

/**
 * Generates a structured project summary from current project data.
 * Returns null if the API key is not configured.
 */
export async function generateProjectSummary(
  ctx: ProjectAiContext,
): Promise<string | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }

  const client = getAnthropicClient();

  const phaseLines = ctx.phases
    .map((p) => `  - ${p.name}: ${p.status}`)
    .join("\n");
  const milestoneLines = ctx.milestones
    .map(
      (m) =>
        `  - ${m.name}: ${m.status}${m.dueDate ? ` (due: ${m.dueDate})` : ""}${m.completedAt ? ` (completed: ${m.completedAt})` : ""}`,
    )
    .join("\n");
  const updateLines = ctx.recentUpdates
    .map(
      (u) =>
        `  - [${u.kind}] ${u.summary}${u.progressPercent != null ? ` (${u.progressPercent}%)` : ""} — ${u.postedAt}`,
    )
    .join("\n");
  const issueLines = ctx.openIssues
    .map((i) => `  - [${i.severity}] ${i.title} (${i.status})`)
    .join("\n");

  const budgetBlock = ctx.budget
    ? `Budget (${ctx.budget.currency}):\n  Approved: ${(ctx.budget.approvedMinor / 100).toLocaleString()}\n  Forecast: ${(ctx.budget.forecastMinor / 100).toLocaleString()}\n  Actual: ${(ctx.budget.actualMinor / 100).toLocaleString()}`
    : "Budget: Not set";

  const userMessage = [
    `Company: ${ctx.companyName}`,
    `Project: ${ctx.projectName}`,
    `Status: ${ctx.projectStatus}`,
    ctx.projectType ? `Type: ${ctx.projectType}` : null,
    ctx.location ? `Location: ${ctx.location}` : null,
    ctx.startDate ? `Start: ${ctx.startDate}` : null,
    ctx.targetCompletionDate ? `Target completion: ${ctx.targetCompletionDate}` : null,
    "",
    `Phases:\n${phaseLines || "  None"}`,
    `Milestones:\n${milestoneLines || "  None"}`,
    `Recent Updates:\n${updateLines || "  None"}`,
    `Open Issues:\n${issueLines || "  None"}`,
    budgetBlock,
    "",
    "Write a concise executive project summary (3-5 paragraphs) covering:",
    "1. Overall status and progress",
    "2. Key milestone achievements and upcoming deadlines",
    "3. Active issues and risks",
    "4. Budget position (if available)",
    "5. Recommended next steps",
  ]
    .filter((l) => l !== null)
    .join("\n")
    .trim();

  const response = await client.messages.create({
    max_tokens: 1024,
    messages: [{ role: "user", content: userMessage }],
    model: "claude-haiku-4-5",
    system:
      "You are a construction project management assistant. Generate clear, factual executive summaries for real-estate development projects. " +
      "Be direct and professional. Focus on facts from the data provided. Do not invent details not present in the input.",
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") return null;

  return textBlock.text.trim();
}

/**
 * Analyzes project data for risk flags (delayed milestones, budget overruns, stale updates).
 * Returns a JSON array of risk objects or null if AI is not configured.
 */
export async function generateProjectRiskFlags(
  ctx: ProjectAiContext,
): Promise<Array<{ severity: string; title: string; detail: string }> | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }

  const client = getAnthropicClient();

  const milestoneLines = ctx.milestones
    .map(
      (m) =>
        `  - ${m.name}: ${m.status}${m.dueDate ? ` (due: ${m.dueDate})` : ""}${m.completedAt ? ` (completed: ${m.completedAt})` : ""}`,
    )
    .join("\n");
  const issueLines = ctx.openIssues
    .map((i) => `  - [${i.severity}] ${i.title} (${i.status})`)
    .join("\n");
  const updateLines = ctx.recentUpdates
    .map((u) => `  - [${u.kind}] ${u.summary} — ${u.postedAt}`)
    .join("\n");

  const budgetBlock = ctx.budget
    ? `Budget (${ctx.budget.currency}):\n  Approved: ${ctx.budget.approvedMinor}\n  Forecast: ${ctx.budget.forecastMinor}\n  Actual: ${ctx.budget.actualMinor}`
    : "Budget: Not set";

  const userMessage = [
    `Project: ${ctx.projectName} (${ctx.projectStatus})`,
    ctx.targetCompletionDate ? `Target completion: ${ctx.targetCompletionDate}` : null,
    "",
    `Milestones:\n${milestoneLines || "  None"}`,
    `Open Issues:\n${issueLines || "  None"}`,
    `Recent Updates:\n${updateLines || "  None"}`,
    budgetBlock,
    "",
    "Analyze the project for risks and return ONLY a JSON array of objects with these fields:",
    '  { "severity": "low"|"medium"|"high"|"critical", "title": "short title", "detail": "one sentence explanation" }',
    "",
    "Look for:",
    "- Overdue or at-risk milestones",
    "- Budget overruns (actual > approved)",
    "- High-severity unresolved issues",
    "- Stale projects with no recent updates",
    "- Schedule pressure (close to target with incomplete milestones)",
    "",
    "Return an empty array [] if no risks are detected.",
    "Return ONLY valid JSON — no markdown, no explanation.",
  ]
    .filter((l) => l !== null)
    .join("\n")
    .trim();

  const response = await client.messages.create({
    max_tokens: 512,
    messages: [{ role: "user", content: userMessage }],
    model: "claude-haiku-4-5",
    system:
      "You are a construction project risk analyst. Analyze project data and identify potential risks. " +
      "Return only a JSON array. Be factual — only flag risks supported by the data.",
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") return null;

  try {
    const parsed = JSON.parse(textBlock.text.trim());
    if (!Array.isArray(parsed)) return [];
    return parsed as Array<{
      severity: string;
      title: string;
      detail: string;
    }>;
  } catch {
    return null;
  }
}

/**
 * Generates a customer-safe progress update draft from internal project data.
 * Strips internal issues, payroll, and budget details — focuses on milestones and progress.
 */
export async function generateCustomerUpdateDraft(
  ctx: ProjectAiContext,
): Promise<string | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }

  const client = getAnthropicClient();

  const milestoneLines = ctx.milestones
    .filter((m) => m.status === "completed" || m.status === "in_progress")
    .map(
      (m) =>
        `  - ${m.name}: ${m.status}${m.completedAt ? ` (completed: ${m.completedAt})` : ""}`,
    )
    .join("\n");
  const updateLines = ctx.recentUpdates
    .slice(0, 5)
    .map((u) => `  - ${u.summary}${u.progressPercent != null ? ` (${u.progressPercent}% progress)` : ""}`)
    .join("\n");
  const phaseLines = ctx.phases
    .map((p) => `  - ${p.name}: ${p.status}`)
    .join("\n");

  const userMessage = [
    `Project: ${ctx.projectName}`,
    ctx.location ? `Location: ${ctx.location}` : null,
    "",
    `Phases:\n${phaseLines || "  None"}`,
    `Key Milestones:\n${milestoneLines || "  None"}`,
    `Recent Progress:\n${updateLines || "  None"}`,
    "",
    "Write a professional, customer-friendly project progress update (2-3 paragraphs).",
    "This will be sent to the property buyer/client.",
    "Focus on:",
    "- Overall progress and current phase",
    "- Completed and upcoming milestones",
    "- Positive momentum and next steps",
    "",
    "Do NOT mention:",
    "- Internal issues, delays, or blockers",
    "- Budget or cost details",
    "- Staff or payroll information",
    "- Severity ratings or risk flags",
    "",
    "Tone: professional, reassuring, transparent about progress without oversharing internal operations.",
  ]
    .filter((l) => l !== null)
    .join("\n")
    .trim();

  const response = await client.messages.create({
    max_tokens: 512,
    messages: [{ role: "user", content: userMessage }],
    model: "claude-haiku-4-5",
    system:
      "You are a real-estate development communications specialist. Write polished progress updates for property buyers and clients. " +
      "Be positive and factual. Never expose internal operational details, budgets, or staffing issues.",
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") return null;

  return textBlock.text.trim();
}
