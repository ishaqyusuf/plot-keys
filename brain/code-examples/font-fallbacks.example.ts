export type FontKey =
  | "inter"
  | "roboto"
  | "manrope"
  | "lora"
  | "plus-jakarta"

export type FontFallbackSlot =
  | "heroTitle"
  | "subscribeButton"
  | "listingPrice"
  | "testimonialQuote"
  | "agentName"

export type FontFallbackMap = Record<
  FontKey,
  Partial<Record<FontFallbackSlot, FontKey>>
>

export const fontFallbacks: FontFallbackMap = {
  inter: {
    subscribeButton: "roboto",
    testimonialQuote: "lora",
  },
  roboto: {
    subscribeButton: "manrope",
    testimonialQuote: "lora",
  },
  manrope: {
    subscribeButton: "inter",
    testimonialQuote: "lora",
  },
  lora: {
    subscribeButton: "inter",
    heroTitle: "manrope",
  },
  "plus-jakarta": {
    subscribeButton: "inter",
    listingPrice: "roboto",
  },
}

export function resolveFontForSlot(
  selected: FontKey,
  slot?: FontFallbackSlot
): FontKey {
  if (!slot) return selected
  return fontFallbacks[selected]?.[slot] || selected
}
