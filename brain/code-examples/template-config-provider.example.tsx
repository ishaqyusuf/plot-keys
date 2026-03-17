"use client"

import React from "react"
import { colorSystems } from "./color-systems.example"
import { stylePresets } from "./style-presets.example"

type FontKey = "inter" | "roboto" | "manrope" | "lora" | "plus-jakarta"
type ColorSystemKey = keyof typeof colorSystems
type StylePresetKey = keyof typeof stylePresets

export type UserTemplateConfig = {
  selectedFont: FontKey
  selectedColorSystem: ColorSystemKey
  selectedStylePreset: StylePresetKey
  images: Record<string, string>
}

export type ResolvedTemplateConfig = {
  font: FontKey
  colorSystem: (typeof colorSystems)[ColorSystemKey]
  stylePreset: (typeof stylePresets)[StylePresetKey]
  images: Record<string, string>
}

function resolveTemplateConfig(
  input: UserTemplateConfig
): ResolvedTemplateConfig {
  return {
    font: input.selectedFont,
    colorSystem: colorSystems[input.selectedColorSystem],
    stylePreset: stylePresets[input.selectedStylePreset],
    images: input.images,
  }
}

const TemplateConfigContext = React.createContext<{
  config: UserTemplateConfig
  resolved: ResolvedTemplateConfig
} | null>(null)

export function TemplateConfigProvider({
  value,
  children,
}: {
  value: UserTemplateConfig
  children: React.ReactNode
}) {
  const resolved = resolveTemplateConfig(value)

  return (
    <TemplateConfigContext.Provider value={{ config: value, resolved }}>
      {children}
    </TemplateConfigContext.Provider>
  )
}

export function useTemplateConfig() {
  const ctx = React.useContext(TemplateConfigContext)
  if (!ctx) throw new Error("Missing TemplateConfigProvider")
  return ctx
}
