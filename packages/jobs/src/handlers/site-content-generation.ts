/**
 * Site content generation job — runs after onboarding completion.
 *
 * Trigger.dev boundary: registered as `website.content.generate` in the
 * Trigger.dev task catalog. Handles:
 *   1. Loading the company's onboarding data and derived profile
 *   2. Calling the AI API to generate field-by-field copy
 *   3. Persisting the generated content into the latest draft SiteConfiguration
 *
 * This is the async counterpart to the synchronous `generateFieldContent()`
 * call in `workspace.route.ts`. The job is enqueued after `completeOnboarding`
 * so the first draft is available immediately (with template defaults), and
 * the AI-improved version is swapped in asynchronously.
 */

export type SiteContentGenerationPayload = {
  /** Internal company identifier. */
  companyId: string;
  /** The SiteConfiguration ID to update with generated content. */
  configId: string;
  /** User ID of the person who triggered the job (for audit). */
  requestedByUserId: string;
};

export async function siteContentGenerationHandler(
  payload: SiteContentGenerationPayload,
  _attempt: number,
): Promise<void> {
  const { createPrismaClient } = await import("@plotkeys/db");

  const { db } = createPrismaClient();
  if (!db) {
    throw new Error(
      "[site-content-generation] No database connection available.",
    );
  }

  const config = await db.siteConfiguration.findFirst({
    include: { company: { include: { memberships: true } } },
    where: { id: payload.configId },
  });

  if (!config) {
    throw new Error(
      `[site-content-generation] SiteConfiguration ${payload.configId} not found.`,
    );
  }

  const onboarding = await db.tenantOnboarding.findFirst({
    where: { userId: config.company.memberships[0]?.userId },
  });

  if (!onboarding) {
    // No onboarding data — skip AI generation
    return;
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    // AI generation disabled in this environment
    return;
  }

  // Dynamically import the Anthropic SDK so environments without the key
  // don't fail on module load.
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const existingContent = (config.contentJson ?? {}) as Record<string, string>;
  const updatedContent = { ...existingContent };

  // Generate content for each field that still holds the template default.
  // Fields that have been manually edited (detected by comparison with the
  // template default) are skipped to preserve human edits.
  const { getTemplateDefinition } = await import("@plotkeys/section-registry");
  const template = getTemplateDefinition(config.templateKey);
  const defaultContent = template.defaultContent;

  const fieldsToGenerate = template.editableFields.filter(
    (field) =>
      field.aiEnabled &&
      (existingContent[field.contentKey] === undefined ||
        existingContent[field.contentKey] ===
          defaultContent[field.contentKey]),
  );

  for (const field of fieldsToGenerate) {
    try {
      const response = await client.messages.create({
        max_tokens: 256,
        messages: [
          {
            content: [
              {
                text: [
                  `Company: ${config.company.name}`,
                  `Market: ${config.company.market ?? "real estate"}`,
                  onboarding.businessSummary
                    ? `Business summary: ${onboarding.businessSummary}`
                    : null,
                  ``,
                  `Field: ${field.label}`,
                  `Detail: ${field.shortDetail}`,
                  field.preferredLength
                    ? `Length: ${field.preferredLength}`
                    : null,
                  ``,
                  `Write ONLY the field value. No labels, no quotes, no explanation.`,
                ]
                  .filter(Boolean)
                  .join("\n"),
                type: "text",
              },
            ],
            role: "user",
          },
        ],
        model: "claude-haiku-4-5",
      });

      const textBlock = response.content.find((b) => b.type === "text");
      if (textBlock && textBlock.type === "text") {
        updatedContent[field.contentKey] = textBlock.text.trim();
      }
    } catch {
      // Individual field failure — continue with remaining fields
    }
  }

  // Persist the updated content
  await db.siteConfiguration.update({
    data: { contentJson: updatedContent },
    where: { id: payload.configId },
  });
}
