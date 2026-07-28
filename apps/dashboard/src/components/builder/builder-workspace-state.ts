import {
  getTemplateDefinition,
  templateCatalog,
} from "@plotkeys/section-registry";
import {
  describeTemplateAccess,
  type SubscriptionTier,
  tierLabels,
} from "@plotkeys/utils";

type CountChangedBuilderContentFieldsInput = {
  draftContent: Record<string, string>;
  liveContent?: Record<string, string>;
};

type ResolveBuilderWorkspaceTemplateAccessInput = {
  licensedTemplateKeys: Set<string>;
  planTier: SubscriptionTier;
  templateKey: string;
};

export function countChangedBuilderContentFields({
  draftContent,
  liveContent,
}: CountChangedBuilderContentFieldsInput) {
  if (!liveContent) return undefined;

  const allKeys = new Set([
    ...Object.keys(draftContent),
    ...Object.keys(liveContent),
  ]);
  let count = 0;

  for (const key of allKeys) {
    if ((draftContent[key] ?? "") !== (liveContent[key] ?? "")) count++;
  }

  return count;
}

export function resolveBuilderWorkspaceTemplateAccess({
  licensedTemplateKeys,
  planTier,
  templateKey,
}: ResolveBuilderWorkspaceTemplateAccessInput) {
  const activeTemplateLabel =
    templateCatalog.find((template) => template.key === templateKey)?.name ??
    templateKey;
  const activeTemplate = getTemplateDefinition(templateKey);
  const templateAccess = describeTemplateAccess(planTier, activeTemplate.tier);
  const currentTemplateLicensed = licensedTemplateKeys.has(templateKey);
  const isTemplateLocked = !currentTemplateLicensed && !templateAccess.allowed;
  const requiredPlan = templateAccess.requiredTier;
  const requiredPlanLabel = tierLabels[requiredPlan];
  const lockedTemplateMessage = [
    templateAccess.message,
    `Upgrade to the ${requiredPlanLabel} plan before editing or publishing this template.`,
  ].join(" ");

  return {
    activeTemplateLabel,
    isTemplateLocked,
    lockedTemplateMessage,
    requiredPlan,
  };
}
