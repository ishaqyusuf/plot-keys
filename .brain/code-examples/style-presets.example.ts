export type StylePreset = "vega" | "nova" | "maia" | "myra" | "lyra";

export type StylePresetDefinition = {
  key: StylePreset;
  name: string;
  spacing: {
    sectionY: string;
    sectionGap: string;
    containerX: string;
    gridGap: string;
  };
  radius: {
    card: string;
    button: string;
    input: string;
    modal: string;
  };
  density: "compact" | "balanced" | "airy";
};

export const stylePresets: Record<StylePreset, StylePresetDefinition> = {
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
  maia: {
    key: "maia",
    name: "Maia",
    spacing: {
      sectionY: "py-28",
      sectionGap: "gap-14",
      containerX: "px-6 md:px-10",
      gridGap: "gap-8",
    },
    radius: {
      card: "rounded-none",
      button: "rounded-none",
      input: "rounded-sm",
      modal: "rounded-sm",
    },
    density: "airy",
  },
  myra: {
    key: "myra",
    name: "Myra",
    spacing: {
      sectionY: "py-16",
      sectionGap: "gap-8",
      containerX: "px-4 md:px-5",
      gridGap: "gap-4",
    },
    radius: {
      card: "rounded-lg",
      button: "rounded-full",
      input: "rounded-full",
      modal: "rounded-xl",
    },
    density: "compact",
  },
  lyra: {
    key: "lyra",
    name: "Lyra",
    spacing: {
      sectionY: "py-20",
      sectionGap: "gap-10",
      containerX: "px-4 md:px-8",
      gridGap: "gap-6",
    },
    radius: {
      card: "rounded-xl",
      button: "rounded-lg",
      input: "rounded-lg",
      modal: "rounded-2xl",
    },
    density: "balanced",
  },
};
