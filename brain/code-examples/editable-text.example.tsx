"use client"

import { useState } from "react"

type EditableContentNode = {
  key: string
  type: "title" | "subtitle" | "body" | "cta" | "label"
  value: string
  description?: string
  minLength?: number
  maxLength?: number
  aiEnabled?: boolean
}

type EditableTextProps = {
  node: EditableContentNode
  as?: "h1" | "h2" | "h3" | "p" | "span"
  isConfigureMode?: boolean
  canUseAI?: boolean
  onSave: (nextValue: string) => Promise<void> | void
  onAiGenerate?: (node: EditableContentNode) => void
}

export function EditableText({
  node,
  as = "p",
  isConfigureMode = false,
  canUseAI = false,
  onSave,
  onAiGenerate,
}: EditableTextProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(node.value)

  const Tag = as

  const handleSave = async () => {
    await onSave(draft)
    setIsEditing(false)
  }

  if (!isConfigureMode) {
    return <Tag>{node.value}</Tag>
  }

  return (
    <div
      className="group relative rounded-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(isHovered || isEditing) && (
        <div className="absolute -top-3 right-0 z-20 flex items-center gap-1 rounded-md border bg-background px-1 py-1 shadow-sm">
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
          {node.aiEnabled && onAiGenerate ? (
            <button
              type="button"
              disabled={!canUseAI}
              onClick={() => onAiGenerate(node)}
            >
              AI
            </button>
          ) : null}
        </div>
      )}

      <div className="rounded-md border border-dashed border-transparent p-1 group-hover:border-border">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="min-h-24 w-full rounded-md border px-3 py-2 text-sm"
            />
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleSave}>
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft(node.value)
                  setIsEditing(false)
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <Tag>{node.value}</Tag>
        )}
      </div>
    </div>
  )
}
