import { z } from "zod"

export type SectionDefinition<TConfig = unknown> = {
  type: string
  label: string
  category: "hero" | "listing" | "agent" | "content" | "form"
  schema: z.ZodType<TConfig>
  defaultConfig: TConfig
  render: React.ComponentType<SectionRenderProps<TConfig>>
  supports: {
    draft: boolean
    live: boolean
  }
}

export type EditableContentNode = {
  key: string
  type: "title" | "subtitle" | "body" | "cta" | "label"
  value: string
  description?: string
  minLength?: number
  maxLength?: number
  aiEnabled?: boolean
}

export type SectionRenderProps<TConfig> = {
  config: TConfig
  isVisible?: boolean
}

export const heroConfigSchema = z.object({
  title: z.object({
    key: z.literal("title"),
    type: z.literal("title"),
    value: z.string().default("Find Your Dream Property"),
    description: z.string().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    aiEnabled: z.boolean().default(true),
  }),
  subtitle: z.object({
    key: z.literal("subtitle"),
    type: z.literal("subtitle"),
    value: z.string().default("Browse premium listings from trusted agents"),
    description: z.string().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    aiEnabled: z.boolean().default(true),
  }),
  ctaHref: z.string().default("/properties"),
})

export type HeroConfig = z.infer<typeof heroConfigSchema>
