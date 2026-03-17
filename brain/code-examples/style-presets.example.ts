export type StylePresetDefinition = {
  key: "vega" | "nova" | "maia" | "myra" | "lyra"
  name: string
  spacing: {
    sectionY: string
    sectionGap: string
    containerX: string
    gridGap: string
  }
  radius: {
    card: string
    button: string
    input: string
    modal: string
  }
  density: "compact" | "balanced" | "airy"
}

export const stylePresets: Record<string, StylePresetDefinition> = {
  vega: {
    key: "vega",
    name: "Vega",
    spacing: {
      sectionY: "py-20",
      sectionGap: "gap-10",
      containerX: "px-4 md:px-6",
      gridGap: "gap-6",
    },
    radius: {
      card: "rounded-2xl",
      button: "rounded-md",
      input: "rounded-md",
      modal: "rounded-2xl",
    },
    density: "balanced",
  },
  nova: {
    key: "nova",
    name: "Nova",
    spacing: {
      sectionY: "py-24",
      sectionGap: "gap-12",
      containerX: "px-5 md:px-8",
      gridGap: "gap-8",
    },
    radius: {
      card: "rounded-3xl",
      button: "rounded-full",
      input: "rounded-xl",
      modal: "rounded-3xl",
    },
    density: "airy",
  },
}
