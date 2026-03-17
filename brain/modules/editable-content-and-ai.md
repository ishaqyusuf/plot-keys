# Editable Content And AI

## Purpose
This file defines the editable-content system for configure mode, inline editing, and AI-assisted content generation.

## Core Rule
- Editable text should be modeled as structured content nodes, not plain strings.

## Editable Content Node
```ts
export type EditableContentNode = {
  key: string
  type: "title" | "subtitle" | "body" | "cta" | "label"
  value: string
  description?: string
  minLength?: number
  maxLength?: number
  aiEnabled?: boolean
}
```

## Why This Model
- click-to-edit
- hover outline
- AI-generate button
- plan gating by feature
- structured AI prompts
- safe persistence into section config

## Configure Mode Behavior
1. hover text block and show outline
2. show top-right action bar
3. click text to edit inline
4. show AI action when the content node is AI-enabled
5. lock or upsell AI access for non-Pro users instead of silently hiding it
6. send structured AI payload with tenant, page, section, and content metadata
7. preview or accept generated content
8. write accepted content back into draft config only

## AI Request Payload
- `tenantId`
- `sectionId`
- `pageSlug`
- `contentKey`
- `contentType`
- optional `currentValue`
- optional `description`
- optional `minLength`
- optional `maxLength`
- tenant information such as:
  - business name
  - location
  - niche
  - tone
  - target audience

## Persistence Rule
- Editable content metadata should live inside section config rather than in ad hoc editor-only state.
- Draft edits should never mutate the live site directly.

## Recommended UI Primitives
- `EditableText`
- `EditableRichText`
- `EditableImage`
- `EditableRepeater`

## Supporting Systems
- section update mutation for content-node value changes
- AI generate mutation
- draft outline and empty-state helpers
- plan-aware feature gating for AI actions
