import type { TenantProfile } from "./onboarding-engine"

export type TemplateDefinition = {
  id: string
  slug: string
  title: string

  segments: Array<
    | "agency_general"
    | "agency_luxury"
    | "developer"
    | "rental_business"
    | "independent_agent"
    | "property_management"
  >

  styles: Array<"minimal" | "luxury" | "corporate" | "modern" | "premium">

  useCases: Array<"lead" | "inventory" | "mixed" | "projects">

  complexity: "simple" | "standard" | "advanced"

  isPaid?: boolean
}

export type ScoredTemplate = TemplateDefinition & {
  score: number
  reasons: string[]
}

export function scoreTemplate(
  template: TemplateDefinition,
  profile: TenantProfile
): ScoredTemplate {
  let score = 0
  const reasons: string[] = []

  if (template.segments.includes(profile.segment)) {
    score += 4
    reasons.push("Matches business segment")
  }

  if (template.styles.includes(profile.designIntent)) {
    score += 3
    reasons.push("Matches design intent")
  }

  if (template.useCases.includes(profile.conversionFocus)) {
    score += 3
    reasons.push("Matches conversion focus")
  }

  if (template.complexity === profile.complexity) {
    score += 2
    reasons.push("Matches business complexity")
  }

  return {
    ...template,
    score,
    reasons,
  }
}

export function recommendTemplates(
  templates: TemplateDefinition[],
  profile: TenantProfile,
  limit = 6
): ScoredTemplate[] {
  return templates
    .map((template) => scoreTemplate(template, profile))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
