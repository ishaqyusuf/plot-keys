import { describe, expect, test } from "bun:test";

import { deriveProfile, scoreTemplates, templateCatalog } from "./index";

describe("template recommendations", () => {
  test("scores register templates from manifest tags", () => {
    const [topRecommendation] = scoreTemplates(
      {
        conversionFocus: "listings",
        designIntent: "clean",
        segment: "rental",
      },
      templateCatalog,
    );

    expect(topRecommendation?.template.key).toBe("riwaq-starter");
    expect(topRecommendation?.reason).toContain("rental");
  });

  test("prefers a matching register template over legacy ties", () => {
    const profile = deriveProfile({
      businessType: "luxury",
      primaryGoal: "build-brand",
      stylePreference: "minimal",
    });

    expect(profile.recommendedTemplateKey).toBe("riwaq-starter");
  });
});
